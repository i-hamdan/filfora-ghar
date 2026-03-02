import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const { phone, otp, name, action } = await request.json();

        if (action === 'send') {
            console.log(`[API Proxy] Sending OTP to ${phone}`);
            const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
                body: { phone }
            });

            if (error) {
                console.error(`[API Proxy] Send OTP error:`, error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json(data);
        }

        if (action === 'verify') {
            console.log(`[API Proxy] Verifying OTP for ${phone}`);
            const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
                body: { phone, otp, name }
            });

            if (error) {
                console.error(`[API Proxy] Verify OTP error:`, error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json(data);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (err: any) {
        console.error(`[API Proxy] Internal error:`, err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
