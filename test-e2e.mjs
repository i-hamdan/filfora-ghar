import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Starting End-to-End Test...");

    // 1. Fetch Menu
    const { data: categories } = await supabase.from('categories').select('*');
    console.log(`Fetched ${categories?.length} categories`);
    const { data: items } = await supabase.from('menu_items').select('*');
    console.log(`Fetched ${items?.length} menu items`);

    if (!items || items.length < 2) {
        console.error("Not enough menu items to test.");
        return;
    }

    // 2. Auth Flow (Admin API User Creation)
    console.log("Generating valid Supabase Auth User...");
    const testPhone = "919800454222";

    // Check if the mock user exists and delete if so for a clean run
    const { data: qUser } = await supabase.auth.admin.listUsers();
    const existing = qUser?.users?.find(u => u.email === "test_e2e@filforaghar.com");
    if (existing) await supabase.auth.admin.deleteUser(existing.id);

    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: "test_e2e@filforaghar.com",
        password: "TempPassword123!",
        email_confirm: true,
        user_metadata: { full_name: "E2E Tester" }
    });

    if (authErr || !authData.user) {
        console.error("Auth Admin Error:", authErr);
        return;
    }

    const { data: profile, error: profileErr } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        phone: testPhone,
        full_name: "E2E Tester"
    }).select().single();

    if (profileErr || !profile) {
        console.error("Failed to create profile:", profileErr);
        return;
    }

    console.log("Profile ready:", profile.id);

    // 3. Address Creation
    console.log("Creating/Fetching Address...");
    const { data: address, error: addressErr } = await supabase.from('addresses').upsert({
        user_id: profile.id,
        tag: "Home",
        details: "123 Test Street",
        is_default: true
    }, { onConflict: 'id' }).select().single();

    if (addressErr) {
        // Since we don't have id in upsert, it might fail. Let's just do an insert.
        console.warn("Address Upsert failed, attempting insert instead...");
        const { data: a2, error: e2 } = await supabase.from('addresses').insert({
            user_id: profile.id,
            tag: "Home",
            details: "123 Test Street",
            is_default: true
        }).select().single();
        if (e2) {
            console.error("Address Error:", e2);
            return;
        }
        Object.assign(address || {}, a2);
    }

    let activeAddressId = address?.id;

    if (!activeAddressId) {
        const { data: allAddrs } = await supabase.from('addresses').select('*').eq('user_id', profile.id).limit(1);
        if (allAddrs && allAddrs.length > 0) activeAddressId = allAddrs[0].id;
    }

    console.log("Address ready:", activeAddressId);

    // 4. Checkout Action (Order Creation)
    console.log("Simulating Checkout...");
    const { data: order, error: orderErr } = await supabase.from('orders').insert({
        user_id: profile.id,
        address_id: activeAddressId,
        total_amount: 1500,
        status: "pending"
    }).select().single();

    if (orderErr) {
        console.error("Order Error:", orderErr);
        return;
    }
    console.log("Order created successfully:", order.id);

    const { error: itemsErr } = await supabase.from('order_items').insert([
        { order_id: order.id, menu_item_id: items[0].id, quantity: 2, price_at_time_of_order: 500 },
        { order_id: order.id, menu_item_id: items[1].id, quantity: 1, price_at_time_of_order: 500 }
    ]);

    if (itemsErr) {
        console.error("Order Items Error:", itemsErr);
        return;
    }
    console.log("Order items attached.");

    // 5. Trigger WhatsApp Confirmation (Network Call)
    console.log("Triggering WhatsApp Confirmation Edge Function...");
    // Sign in the mock user to obtain a valid session JWT for Edge Function invocation
    await supabase.auth.signInWithPassword({
        email: "test_e2e@filforaghar.com",
        password: "TempPassword123!"
    });

    // 5. Trigger WhatsApp Confirmation (SDK Invocation)
    console.log("Triggering WhatsApp Confirmation Edge Function via SDK...");
    const { data: fnData, error: fnError } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
            order_id: order.id,
            phone: testPhone
        }
    });

    if (fnError) {
        console.error("WhatsApp API Error:", fnError);
        console.error("Test failed at WhatsApp confirmation stage.");
    } else {
        console.log("WhatsApp API Data Response:", fnData);
        console.log("Cleaning up test order...");
        await supabase.from('orders').delete().eq('id', order.id);
        console.log("E2E Test Completed Successfully!");
    }
}

run();
