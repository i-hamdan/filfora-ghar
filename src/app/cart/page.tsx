"use client";

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { sampleMenuItems } from "@/lib/data";
import { Minus, Plus, ShoppingBag, Trash2, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";

export default function CartPage() {
    const { items, updateQuantity, removeItem } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

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
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-6rem)] md:min-h-screen bg-white dark:bg-zinc-950 pb-24 md:pb-0">
            {/* Header */}
            <div className="pt-24 pb-6 px-4 md:px-8 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                        Your Cart
                    </h1>
                </div>
            </div>

            {/* Cart Content */}
            <div className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-8 py-8">
                {cartItemsWithDetails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 gap-6">
                        <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-inner">
                            <ShoppingBag className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Your cart is empty</h2>
                            <p className="text-zinc-500 dark:text-zinc-400">Looks like you haven't added anything yet.</p>
                        </div>
                        <button
                            onClick={() => router.push('/#menu')}
                            className="mt-4 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
                        >
                            Browse our menu
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Items List */}
                        <div className="flex-grow flex flex-col gap-4">
                            {cartItemsWithDetails.map(item => (
                                <div key={item.id} className="flex gap-4 p-4 md:p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 items-center transition-all hover:shadow-md">
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col flex-grow h-full justify-between">
                                        <div className="flex justify-between items-start gap-4">
                                            <h4 className="font-semibold text-lg md:text-xl text-zinc-900 dark:text-zinc-100 line-clamp-2">{item.name}</h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 -m-2 text-zinc-400 hover:text-red-500 transition-colors bg-white dark:bg-zinc-800 rounded-lg shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-end justify-between mt-auto pt-4">
                                            <span className="font-bold text-xl md:text-2xl text-primary">₹{item.price * item.quantity}</span>

                                            <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-1.5 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 transition-colors rounded-lg"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-6 text-center text-base font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors rounded-lg"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4">
                                <button
                                    onClick={() => router.push('/#menu')}
                                    className="w-full py-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-zinc-600 dark:text-zinc-400 font-semibold flex items-center justify-center gap-2 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary hover:bg-primary/5 transition-all duration-300"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    Add more items from menu
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Checkout Box */}
                        <div className="w-full lg:w-[400px] flex-shrink-0">
                            <div className="bg-zinc-50 dark:bg-zinc-900/80 rounded-3xl p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 sticky top-32">
                                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                                <div className="flex flex-col gap-4 mb-8">
                                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-zinc-900 dark:text-zinc-100">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                                        <span>Delivery Fee (estimated)</span>
                                        <span className="text-zinc-900 dark:text-zinc-100">₹{deliveryFee}</span>
                                    </div>
                                    <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
                                    <div className="flex justify-between text-2xl font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">₹{total}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckoutClick}
                                    className="w-full bg-primary hover:bg-primary-dark text-white p-5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transform hover:-translate-y-0.5"
                                >
                                    {isAuthenticated ? "Proceed to Checkout" : "Log in to Checkout"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    // Prevent immediate redirect if further setup needed, but otherwise:
                    router.push("/checkout/delivery");
                }}
            />
        </div>
    );
}
