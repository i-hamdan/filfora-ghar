"use client";

import { useState } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { categories, sampleMenuItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

export function MenuFeed() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const addItem = useCartStore((state) => state.addItem);

    const filteredItems = sampleMenuItems.filter((item) =>
        activeCategory === "All" ? true : item.category === activeCategory
    );

    const selectedItem = sampleMenuItems.find(i => i.id === selectedItemId) || null;

    const handleAddToCart = (id: string, quantity: number = 1) => {
        addItem(id, quantity);
    };

    const handleOpenDetails = (id: string) => {
        setSelectedItemId(id);
    };

    const handleCloseDetails = () => {
        setSelectedItemId(null);
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Category Tabs */}
            <div className="sticky top-20 z-40 bg-background/90 backdrop-blur-xl py-4 -mx-4 px-4 overflow-x-auto border-b border-zinc-100 dark:border-zinc-800 no-scrollbar">
                <div className="flex items-center gap-2 md:justify-center min-w-max">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                activeCategory === category
                                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        onAdd={(id) => handleAddToCart(id, 1)}
                        onClick={handleOpenDetails}
                    />
                ))}
            </div>

            {/* Modal */}
            <ItemDetailsModal
                isOpen={!!selectedItemId}
                onClose={handleCloseDetails}
                item={selectedItem}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}
