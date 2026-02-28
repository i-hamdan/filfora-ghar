"use client";

import { useCartStore } from "@/store/useCartStore";
import { sampleMenuItems } from "@/lib/data";
import { ShoppingBag, Trash2, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCartBar() {
    const { items, clearCart, openCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate total price to show in the bar
    const total = items.reduce((sum, item) => {
        const details = sampleMenuItems.find(i => i.id === item.id);
        return sum + ((details?.price || 0) * item.quantity);
    }, 0);

    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.div
                    initial={{ y: 150, opacity: 0, x: "-50%" }}
                    animate={{ y: 0, opacity: 1, x: "-50%" }}
                    exit={{ y: 150, opacity: 0, x: "-50%" }}
                    className="hidden md:flex fixed bottom-6 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md bg-zinc-900/95 dark:bg-white/95 backdrop-blur-md rounded-[1.25rem] p-3 shadow-2xl border border-zinc-800/50 dark:border-zinc-200/50 text-white dark:text-zinc-900 items-center justify-between"
                >
                    <div className="flex items-center gap-3 pl-2">
                        <div className="bg-white/10 dark:bg-black/5 w-10 h-10 rounded-full flex items-center justify-center relative shadow-inner">
                            <ShoppingBag className="w-5 h-5" />
                            <motion.span
                                key={count}
                                initial={{ scale: 1.5, rotate: 15 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                            >
                                {count}
                            </motion.span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-wide">{count} item{count > 1 ? 's' : ''}</span>
                            <span className="text-xs opacity-70 font-semibold tracking-wide">₹{total}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearCart();
                            }}
                            className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-black/5 text-zinc-400 hover:text-red-400 dark:text-zinc-500 dark:hover:text-red-600 transition-colors group"
                            title="Clear cart"
                        >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={openCart}
                            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-1 hover:pr-4 group"
                        >
                            View Cart <ChevronRight className="w-4 h-4 -mr-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
