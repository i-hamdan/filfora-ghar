"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { sampleMenuItems } from "@/lib/data";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdminMenu() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold title-font text-zinc-900 dark:text-zinc-100">Menu Management</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Add, edit or disable menu items.</p>
                </div>

                <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    <Plus className="w-5 h-5" />
                    Add New Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sampleMenuItems.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 flex gap-4 shadow-sm group">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-100">
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.name}</h3>
                                    {item.is_available ? (
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" title="Available"></span>
                                    ) : (
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" title="Out of Stock"></span>
                                    )}
                                </div>
                                <p className="font-medium text-primary mt-0.5">₹{item.price}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-1">{item.category}</p>
                            </div>

                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
