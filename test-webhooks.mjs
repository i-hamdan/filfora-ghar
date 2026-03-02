import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data } = await supabase.from("otp_verifications").select("*").eq("phone", "WEBHOOK_LOG").order('created_at', { ascending: false }).limit(5);
    console.log("Recent Webhook Logs:");
    data.forEach(x => {
        try {
            console.log(JSON.stringify(JSON.parse(x.otp_code), null, 2));
        } catch(e) { console.log(x.otp_code); }
    });
}
check();
