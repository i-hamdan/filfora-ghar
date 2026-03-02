"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { MenuItemCard } from "./MenuItemCard";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

export function MenuFeed() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Dietary filter state
    const [dietaryFilter, setDietaryFilter] = useState("All");
    const [isDietaryOpen, setIsDietaryOpen] = useState(false);

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const addItem = useCartStore((state) => state.addItem);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dietaryRef = useRef<HTMLDivElement>(null);

    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMenu() {
            setIsLoading(true);
            const [catsRes, itemsRes] = await Promise.all([
                supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
                supabase.from('menu_items').select('*, categories(name)').eq('is_available', true).order('sort_order', { ascending: true })
            ]);

            if (catsRes.data) setCategories(catsRes.data);
            if (itemsRes.data) {
                const mappedItems = itemsRes.data.map(item => ({
                    ...item,
                    category: item.categories?.name || 'Uncategorized',
                    dietary_tags: item.dietary_tags || [],
                    image_url: item.image_url || '/assets/image_placeholder.jpg'
                }));
                setMenuItems(mappedItems);
            }
            setIsLoading(false);
        }
        fetchMenu();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (dietaryRef.current && !dietaryRef.current.contains(event.target as Node)) {
                setIsDietaryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredItems = menuItems.filter((item) => {
        const categoryMatch = activeCategory === "All" ? true : item.category === activeCategory;
        const dietaryMatch = dietaryFilter === "All" ? true : item.dietary_tags.includes(dietaryFilter);
        return categoryMatch && dietaryMatch;
    });

    const selectedItem = menuItems.find(i => i.id === selectedItemId) || null;

    const handleAddToCart = (item: any, quantity: number = 1) => {
        addItem(item, quantity);
    };

    const handleOpenDetails = (id: string) => {
        setSelectedItemId(id);
    };

    const handleCloseDetails = () => {
        setSelectedItemId(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Filters */}
            <div className="z-40 bg-background/95 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-zinc-100 dark:border-zinc-800 shadow-sm transition-all flex items-center justify-center md:justify-start gap-4">

                {/* Category Dropdown & Clear */}
                <div className="relative w-40">
                    <div ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={cn(
                                "flex items-center justify-between w-full px-5 py-2.5 text-left border rounded-full shadow-sm transition-all duration-300",
                                activeCategory !== "All"
                                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200"
                            )}
                        >
                            <span className="font-semibold tracking-wide text-sm truncate pr-2">
                                {activeCategory === "All" ? "Category" : activeCategory}
                            </span>

                            <ChevronDown className={cn(
                                "w-4 h-4 shrink-0 transition-transform duration-300",
                                activeCategory !== "All" ? "text-white/90" : "text-zinc-400",
                                isDropdownOpen ? "rotate-180" : ""
                            )} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-48 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setActiveCategory(category.name);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-3 text-sm transition-colors border-b border-zinc-100 last:border-0 dark:border-zinc-800",
                                            activeCategory === category.name
                                                ? "bg-primary/10 text-primary font-bold"
                                                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 font-medium"
                                        )}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear Category Button (Overlapped) */}
                    {activeCategory !== "All" && (
                        <button
                            onClick={() => setActiveCategory("All")}
                            className="absolute -top-1.5 -right-1.5 z-10 p-1 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 rounded-full transition-all shadow-sm"
                            title="Clear category filter"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Dietary Dropdown & Clear */}
                <div className="relative w-36">
                    <div ref={dietaryRef}>
                        <button
                            onClick={() => setIsDietaryOpen(!isDietaryOpen)}
                            className={cn(
                                "flex items-center justify-between w-full px-5 py-2.5 text-left border rounded-full shadow-sm transition-all duration-300",
                                dietaryFilter !== "All"
                                    ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20 scale-[1.02]"
                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200"
                            )}
                        >
                            <span className="font-semibold tracking-wide text-sm truncate pr-2">
                                {dietaryFilter === "All" ? "Dietary" : dietaryFilter}
                            </span>

                            <ChevronDown className={cn(
                                "w-4 h-4 shrink-0 transition-transform duration-300",
                                dietaryFilter !== "All" ? "text-white/90" : "text-zinc-400",
                                isDietaryOpen ? "rotate-180" : ""
                            )} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDietaryOpen && (
                            <div className="absolute top-full left-0 w-36 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top">
                                {["All", "Veg", "Non-Veg"].map((diet) => (
                                    <button
                                        key={diet}
                                        onClick={() => {
                                            setDietaryFilter(diet);
                                            setIsDietaryOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-3 text-sm transition-colors border-b border-zinc-100 last:border-0 dark:border-zinc-800",
                                            dietaryFilter === diet
                                                ? "bg-green-600/10 text-green-600 font-bold"
                                                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 font-medium"
                                        )}
                                    >
                                        {diet}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear Dietary Button (Overlapped) */}
                    {dietaryFilter !== "All" && (
                        <button
                            onClick={() => setDietaryFilter("All")}
                            className="absolute -top-1.5 -right-1.5 z-10 p-1 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 rounded-full transition-all shadow-sm"
                            title="Clear dietary filter"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        onAdd={(addedItem) => handleAddToCart(addedItem, 1)}
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
