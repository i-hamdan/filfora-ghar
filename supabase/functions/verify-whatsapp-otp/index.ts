import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

serve(async (req: Request) => {
    // CORS headers
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
    }

    try {
        const { phone, otp, name } = await req.json();

        if (!phone || !otp) {
            return new Response(JSON.stringify({ error: "Missing phone or otp" }), { status: 400 });
        }

        // 1. Verify OTP
        const { data: verifications, error: queryError } = await supabaseAdmin
            .from('otp_verifications')
            .select('*')
            .eq('phone', phone)
            .eq('otp_code', otp)
            .eq('is_verified', false)
            .gte('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1);

        if (queryError) throw queryError;

        if (!verifications || verifications.length === 0) {
            return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        const verification = verifications[0];

        // 2. Mark OTP as verified
        await supabaseAdmin
            .from('otp_verifications')
            .update({ is_verified: true })
            .eq('id', verification.id);

        // 3. Upsert User in Supabase Auth
        // Our Clever Workaround: We use a deterministic "email" mapping to the phone number
        const authEmail = `${phone.replace('+', '')}@filforaghar.com`;
        const defaultPassword = "FilforaWhatsAppAuth2026!"; // The frontend will use this to sign in

        // Check if user exists
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        let authUser = existingUsers?.users?.find(u => u.email === authEmail);

        if (!authUser) {
            // Create the auth user
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: authEmail,
                password: defaultPassword,
                email_confirm: true,
                user_metadata: { phone }
            });

            if (createError) throw createError;
            authUser = newUser.user;

            // 4. Create the corresponding public Profile
            if (authUser) {
                await supabaseAdmin.from('profiles').insert({
                    id: authUser.id,
                    phone: phone,
                    full_name: name || "Guest Customer"
                });
            }
        } else if (name) {
            // Update name if provided and user already exists
            await supabaseAdmin.from('profiles').update({ full_name: name }).eq('id', authUser.id);
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });

    } catch (err: any) {
        console.error("Error verifying OTP:", err);
        return new Response(JSON.stringify({ error: err.message || "Internal server error" }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
});
