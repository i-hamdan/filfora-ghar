import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    try {
        const { phone, otp, name, action } = await request.json();

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({
                error: "Server configuration error. Missing Supabase keys."
            }, { status: 500 });
        }

        const functionName = action === 'send' ? 'send-whatsapp-otp' : 'verify-whatsapp-otp';
        const payload = action === 'send' ? { phone } : { phone, otp, name: name || "" };
        const functionUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/${functionName}`;
        const cleanKey = supabaseServiceKey.trim();

        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanKey}`
            },
            body: JSON.stringify(payload)
        });

        const status = response.status;
        const responseText = await response.text();

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            data = { text: responseText };
        }

        if (!response.ok) {
            return NextResponse.json({
                error: data.error || `Error ${status}: ${responseText.slice(0, 100)}`
            }, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (err: any) {
        console.error(`[OTP-PROXY] Critical Failure:`, err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
