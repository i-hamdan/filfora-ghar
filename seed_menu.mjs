import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
    console.log("Seeding Database...");

    // Check if categories exist
    const { data: existingCats } = await supabase.from('categories').select('*');
    if (existingCats && existingCats.length > 0) {
        console.log("Categories already exist. Skipping seed.");
        // Still check items
        const { data: existingItems } = await supabase.from('menu_items').select('*');
        if (existingItems && existingItems.length >= 2) {
            console.log("Menu items exist. Skipping seed.");
            return;
        }

        const { error: menuErr } = await supabase.from('menu_items').insert([
            {
                category_id: existingCats[0].id,
                name: "Classic Chicken Biryani",
                description: "Aromatic basmati rice layered with spiced chicken.",
                price: 350,
                image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
                spice_level: 2,
                dietary_tags: ["Non-Veg", "Halal"],
                is_available: true,
                sort_order: 1
            },
            {
                category_id: existingCats[0].id,
                name: "Mutton Nalli Nihari",
                description: "Slow-cooked mutton stew.",
                price: 550,
                image_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?w=800",
                spice_level: 3,
                dietary_tags: ["Non-Veg", "Halal"],
                is_available: true,
                sort_order: 2
            }
        ]);
        if (menuErr) console.error("Menu items insert error:", menuErr);
        console.log("Seeded basic items into existing category.");
        return;
    }

    const { data: cat1, error: e1 } = await supabase.from('categories').upsert({ name: 'Biryani', sort_order: 1, is_active: true }, { onConflict: 'name' }).select().single();
    const { data: cat2, error: e2 } = await supabase.from('categories').upsert({ name: 'Curries', sort_order: 2, is_active: true }, { onConflict: 'name' }).select().single();

    if (e1 || e2) {
        console.error("Categories failed to insert/upsert:", e1, e2);
        return;
    }

    await supabase.from('menu_items').insert([
        {
            category_id: cat1.id,
            name: "Classic Chicken Biryani",
            description: "Aromatic basmati rice layered with spiced chicken.",
            price: 350,
            image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
            spice_level: "Medium",
            dietary_tags: ["Non-Veg", "Halal"],
            is_available: true,
            sort_order: 1
        },
        {
            category_id: cat2.id,
            name: "Mutton Nalli Nihari",
            description: "Slow-cooked mutton stew.",
            price: 550,
            image_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?w=800",
            spice_level: "High",
            dietary_tags: ["Non-Veg", "Halal"],
            is_available: true,
            sort_order: 1
        }
    ]);
    if (menuErr2) console.error("Menu items insert error:", menuErr2);

    console.log("Seeded successfully!");
}

seed().catch(console.error);
