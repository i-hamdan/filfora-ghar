"use client";

import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ItemDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        id: string;
        name: string;
        description: string;
        price: number;
        image_url: string;
        dietary_tags: string[];
        spice_level: string;
        category?: string;
    } | null;
    onAddToCart: (item: any, quantity: number) => void;
}

export function ItemDetailsModal({ isOpen, onClose, item, onAddToCart }: ItemDetailsModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    // Reset quantity and state when new item is opened
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setIsAdded(false);
        }
    }, [isOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!item) return null;

    const handleAddToCart = () => {
        if (item) {
            onAddToCart(item, quantity);
            setIsAdded(true);
            // We no longer close automatically after 800ms
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center pointer-events-none p-4 sm:p-6 outline-none">
                        {/* Modal Content */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
                        >
                            {/* Image Header */}
                            <div className="relative w-full h-64 sm:h-80 flex-shrink-0">
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Body */}
                            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-grow">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <h2 className="text-2xl sm:text-3xl font-bold title-font text-zinc-900 dark:text-zinc-50">
                                        {item.name}
                                    </h2>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {item.dietary_tags.map(tag => (
                                        <span
                                            key={tag}
                                            className={cn(
                                                "px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider",
                                                tag === "Veg" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "",
                                                tag === "Non-Veg" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "",
                                                tag !== "Veg" && tag !== "Non-Veg" ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" : ""
                                            )}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full uppercase tracking-wider">
                                        {item.spice_level} Spice
                                    </span>
                                </div>

                                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8">
                                    {item.description}
                                </p>
                            </div>

                            {/* Sticky Footer for Action */}
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-4 flex-shrink-0 backdrop-blur-md">
                                {isAdded ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full space-y-3"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold mb-2">
                                            <Check className="w-6 h-6" /> Item added to cart!
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    window.location.href = '/cart';
                                                }}
                                                className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                            >
                                                Checkout Now <ShoppingBag className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 py-4 rounded-2xl font-bold transition-all"
                                            >
                                                Add More Items
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center justify-between w-full sm:w-auto bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-1 shadow-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-3 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors disabled:opacity-50"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                            <span className="w-12 text-center font-semibold text-lg">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-3 text-zinc-500 hover:text-primary dark:text-zinc-400 transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleAddToCart}
                                            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold bg-primary hover:bg-primary-dark text-white shadow-[0_4_14_0_rgba(249,115,22,0.39)] hover:shadow-[0_6_20_rgba(249,115,22,0.23)] hover:-translate-y-0.5 transition-all"
                                        >
                                            <span className="flex items-center gap-2">
                                                <ShoppingBag className="w-5 h-5" />
                                                Add item
                                            </span>
                                            <span>
                                                ₹{item.price * quantity}
                                            </span>
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
