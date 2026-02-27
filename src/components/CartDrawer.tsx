"use client";

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { sampleMenuItems } from "@/lib/data";
import { AuthModal } from "./AuthModal";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, updateQuantity, removeItem } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll
    useEffect(() => {
        if (isOpen || isAuthModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, isAuthModalOpen]);

    if (!mounted) return null; // Hydration guard for zustand persist

    const cartItemsWithDetails = items.map(item => {
        const details = sampleMenuItems.find(i => i.id === item.id);
        return { ...item, ...details };
    }).filter((item): item is (typeof item & { price: number; name: string; image_url: string; id: string }) => !!item.price);

    const subtotal = cartItemsWithDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 50; // Mock delivery fee
    const total = subtotal > 0 ? subtotal + deliveryFee : 0;

    const handleCheckoutClick = () => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
        } else {
            router.push("/checkout/delivery");
            onClose();
        }
    };

    return (
        <>
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

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col pt-4 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <ShoppingBag className="w-6 h-6 text-primary" />
                                    Your Cart
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-grow overflow-y-auto px-6 py-6 custom-scrollbar">
                                {cartItemsWithDetails.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                            <ShoppingBag className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                                        </div>
                                        <p className="font-medium text-lg">Your cart is empty</p>
                                        <button onClick={onClose} className="text-primary font-medium hover:underline">
                                            Browse our menu
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        {cartItemsWithDetails.map(item => (
                                            <div key={item.id} className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 items-center">
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex flex-col flex-grow h-full justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 pr-2">{item.name}</h4>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-zinc-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto pt-2">
                                                        <span className="font-bold text-primary">₹{item.price * item.quantity}</span>

                                                        <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-7 h-7 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-red-500 disabled:opacity-50 transition-colors rounded-md"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-7 h-7 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-green-500 transition-colors rounded-md"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {cartItemsWithDetails.length > 0 && (
                                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800 mt-auto backdrop-blur-md">
                                    <div className="flex flex-col gap-3 mb-6">
                                        <div className="flex justify-between text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                                            <span>Subtotal</span>
                                            <span>₹{subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                                            <span>Delivery Fee (estimated)</span>
                                            <span>₹{deliveryFee}</span>
                                        </div>
                                        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">₹{total}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCheckoutClick}
                                        className="w-full bg-primary hover:bg-primary-dark text-white p-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transform hover:-translate-y-0.5"
                                    >
                                        {isAuthenticated ? "Proceed to Checkout" : "Log in to Checkout"}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    // Auto-trigger checkout if they logged in successfully here
                    console.log("Proceeding to checkout after auth with total:", total);
                    alert("Redirect to Delivery & Payment Step!");
                }}
            />
        </>
    );
}
