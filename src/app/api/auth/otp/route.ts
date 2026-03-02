import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    try {
        const { phone, otp, name, action } = await request.json();

        console.log(`[OTP-PROXY] Action: ${action}, Phone: ${phone}`);

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("[OTP-PROXY] Missing environment variables!", {
                url: !!supabaseUrl,
                key: !!supabaseServiceKey
            });
            return NextResponse.json({
                error: "Server configuration error. Missing Supabase keys in Netlify."
            }, { status: 500 });
        }

        const functionName = action === 'send' ? 'send-whatsapp-otp' : 'verify-whatsapp-otp';
        const payload = action === 'send' ? { phone } : { phone, otp, name: name || "" };

        console.log(`[OTP-PROXY] Key Length: ${supabaseServiceKey?.length}, Starts with: ${supabaseServiceKey?.substring(0, 10)}...`);
        console.log(`[OTP-PROXY] Calling ${functionName}...`);

        // We use direct fetch to exactly match the successful manual curl
        const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey?.trim()}`
            },
            body: JSON.stringify(payload)
        });

        const status = response.status;
        const responseText = await response.text();

        console.log(`[OTP-PROXY] Response Status: ${status}`);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            data = { text: responseText };
        }

        if (!response.ok) {
            console.error(`[OTP-PROXY] ${functionName} failed:`, { status, data });
            return NextResponse.json({
                error: data.error || `Edge Function returned ${status}: ${responseText.slice(0, 100)}`
            }, { status: 500 });
        }

        console.log(`[OTP-PROXY] ${functionName} success!`);
        return NextResponse.json(data);

    } catch (err: any) {
        console.error(`[OTP-PROXY] Critical Failure:`, err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
