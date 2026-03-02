"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Image as ImageIcon, CheckCircle2, XCircle, Utensils } from "lucide-react";

interface Category {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
}

interface MenuItem {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_available: boolean;
}

export default function AdminMenuPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: "",
        category_id: "",
        price: "",
        description: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [catsRes, itemsRes] = await Promise.all([
            supabase.from('categories').select('*').order('sort_order', { ascending: true }),
            supabase.from('menu_items').select('*').order('sort_order', { ascending: true })
        ]);

        if (catsRes.data) setCategories(catsRes.data);
        if (itemsRes.data) setItems(itemsRes.data);

        if (catsRes.data && catsRes.data.length > 0 && !newItem.category_id) {
            setNewItem(prev => ({ ...prev, category_id: catsRes.data[0].id }));
        }
        setLoading(false);
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        const { data, error } = await supabase.from('categories').insert([
            { name: newCategoryName }
        ]).select();

        if (!error && data) {
            setCategories([...categories, data[0]]);
            setNewCategoryName("");
            setIsAddCategoryOpen(false);
        } else {
            alert("Error creating category: " + error?.message);
        }
    };

    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price || !newItem.category_id) return;

        const { data, error } = await supabase.from('menu_items').insert([
            {
                name: newItem.name,
                price: parseFloat(newItem.price),
                category_id: newItem.category_id,
                description: newItem.description
            }
        ]).select();

        if (!error && data) {
            setItems([...items, data[0]]);
            setNewItem({ name: "", category_id: categories[0]?.id || "", price: "", description: "" });
            setIsAddItemOpen(false);
        } else {
            alert("Error creating item: " + error?.message);
        }
    };

    const toggleItemAvailability = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase.from('menu_items').update({ is_available: !currentStatus }).eq('id', id);
        if (!error) {
            setItems(items.map(i => i.id === id ? { ...i, is_available: !currentStatus } : i));
        }
    };

    if (loading) {
        return <div className="text-zinc-500 animate-pulse">Loading menu data...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black title-font">Menu Management</h1>
                    <p className="text-zinc-500 mt-1">Add, edit, and organize your dishes.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddCategoryOpen(true)}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors text-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Category
                    </button>
                    <button
                        onClick={() => setIsAddItemOpen(true)}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-black rounded-xl font-bold transition-colors text-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Menu Item
                    </button>
                </div>
            </div>

            {/* Quick Add Forms */}
            {isAddCategoryOpen && (
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4">Add New Category</h3>
                    <form onSubmit={handleCreateCategory} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="e.g., Main Course, Desserts"
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="px-6 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark">Save</button>
                        <button type="button" onClick={() => setIsAddCategoryOpen(false)} className="px-4 text-zinc-500 hover:text-white">Cancel</button>
                    </form>
                </div>
            )}

            {isAddItemOpen && (
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4">Add New Menu Item</h3>
                    {categories.length === 0 ? (
                        <p className="text-red-400 text-sm">Please create a Category first.</p>
                    ) : (
                        <form onSubmit={handleCreateItem} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-400 font-bold mb-1 block uppercase">Dish Name</label>
                                    <input type="text" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 font-bold mb-1 block uppercase">Price (₹)</label>
                                    <input type="number" required min="0" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs text-zinc-400 font-bold mb-1 block uppercase">Category</label>
                                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" value={newItem.category_id} onChange={e => setNewItem({ ...newItem, category_id: e.target.value })}>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs text-zinc-400 font-bold mb-1 block uppercase">Description</label>
                                    <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" rows={2} value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                                <button type="button" onClick={() => setIsAddItemOpen(false)} className="px-4 py-2 text-zinc-500 hover:text-white font-bold">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark">Create Item</button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Menu Display */}
            <div className="space-y-12">
                {categories.map(category => {
                    const categoryItems = items.filter(i => i.category_id === category.id);
                    return (
                        <div key={category.id} className="space-y-4">
                            <div className="flex items-center gap-4 border-b border-zinc-800 pb-2">
                                <h2 className="text-xl font-bold text-white">{category.name}</h2>
                                <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full font-bold">{categoryItems.length} items</span>
                            </div>

                            {categoryItems.length === 0 ? (
                                <p className="text-zinc-600 text-sm italic">No items in this category yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categoryItems.map(item => (
                                        <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 hover:border-zinc-700 transition-colors">
                                            <div className="w-20 h-20 bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-800 flex-shrink-0 border border-zinc-800">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 text-zinc-700" />
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-zinc-100">{item.name}</h4>
                                                        <span className="font-black text-primary">₹{item.price}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
                                                </div>
                                                <div className="flex justify-between items-center mt-3">
                                                    <button
                                                        onClick={() => toggleItemAvailability(item.id, item.is_available)}
                                                        className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${item.is_available ? 'text-green-500 bg-green-500/10 hover:bg-green-500/20' : 'text-red-500 bg-red-500/10 hover:bg-red-500/20'}`}
                                                    >
                                                        {item.is_available ? <><CheckCircle2 className="w-3 h-3" /> Active</> : <><XCircle className="w-3 h-3" /> Out of Stock</>}
                                                    </button>
                                                    <div className="flex gap-2">
                                                        <button className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800"><Edit2 className="w-4 h-4" /></button>
                                                        <button className="p-1.5 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {categories.length === 0 && !loading && (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-3xl">
                        <Utensils className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-zinc-300">Your Menu is Empty</h3>
                        <p className="text-zinc-500 text-sm mt-1 mb-6">Create a category to get started.</p>
                        <button onClick={() => setIsAddCategoryOpen(true)} className="px-6 py-2 bg-primary text-black font-bold rounded-xl">Add Category</button>
                    </div>
                )}
            </div>
        </div>
    );
}
