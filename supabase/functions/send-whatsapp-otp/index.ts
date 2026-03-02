import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
    }

    try {
        const { phone } = await req.json();

        if (!phone) {
            return new Response(JSON.stringify({ error: "Missing phone number" }), { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 5 minutes expiry
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        // Store in DB
        const { error: dbError } = await supabase.from('otp_verifications').insert({
            phone,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            is_verified: false
        });

        if (dbError) throw dbError;

        // Clean phone for Meta (no '+')
        const cleanPhone = phone.replace('+', '');

        // Call Meta
        const metaRes = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: cleanPhone,
                type: "template",
                template: {
                    name: "test_tempalte",
                    language: {
                        code: "en_US"
                    },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                {
                                    type: "text",
                                    text: "Customer"
                                },
                                {
                                    type: "text",
                                    text: `Your OTP is: ${otp}`
                                },
                                {
                                    type: "text",
                                    text: "the Filfora Team"
                                }
                            ]
                        }
                    ]
                }
            })
        });

        const metaData = await metaRes.json();

        if (!metaRes.ok) {
            throw new Error(JSON.stringify(metaData));
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });

    } catch (err: any) {
        console.error("Error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
});
