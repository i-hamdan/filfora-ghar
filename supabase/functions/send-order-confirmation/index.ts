import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  try {
    const { order_id, phone } = await req.json();

    if (!phone || !order_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // Clean phone for Meta (no '+')
    const cleanPhone = phone.toString().replace('+', '');

    // Call Meta using the support_ticket utility template workaround
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
                  text: `Order ${order_id.slice(0, 8).toUpperCase()}`
                },
                {
                  type: "text",
                  text: "us"
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
    console.error("Error sending order confirmation:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
});
