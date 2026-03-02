"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Receipt, CheckCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ReviewOrderPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const { items, checkoutDetails, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && (!isAuthenticated || items.length === 0)) {
            router.push("/");
        }
    }, [mounted, isAuthenticated, items.length, router]);

    if (!mounted || !isAuthenticated || items.length === 0) return null;

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    const handlePlaceOrder = async () => {
        if (!user || !checkoutDetails.addressId || !checkoutDetails.date) {
            alert("Missing checkout details. Please go back and select a delivery address and date.");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create the Order
            const { data: order, error: orderError } = await supabase.from('orders').insert({
                user_id: user.id,
                address_id: checkoutDetails.addressId,
                total_amount: total,
                status: 'pending'
            }).select().single();

            if (orderError) throw orderError;

            // 2. Create the Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                menu_item_id: item.id,
                quantity: item.quantity,
                price_at_time_of_order: item.price
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

            if (itemsError) {
                // Rollback
                await supabase.from('orders').delete().eq('id', order.id);
                throw itemsError;
            }

            // 3. Trigger WhatsApp Order Confirmation
            supabase.functions.invoke('send-order-confirmation', {
                body: { order_id: order.id, phone: user.phone }
            }).catch(err => console.error("Failed to trigger WhatsApp confirmation:", err));

            clearCart();
            router.push("/checkout/success");
        } catch (err: any) {
            console.error("Checkout failed:", err);
            alert("Checkout failed. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-zinc-50 dark:bg-black min-h-screen pb-28">
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-30 pt-16 pb-4 px-4 shadow-sm">
                <div className="container mx-auto max-w-2xl flex items-center justify-between">
                    <Link href="/checkout/delivery" className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold title-font">Review Order</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="container mx-auto max-w-2xl px-4 mt-8 space-y-6">

                {/* Order Items */}
                <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                        <div className="flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Order Summary</h2>
                        </div>
                        <Link href="/cart" className="text-sm font-bold text-primary hover:underline">
                            Edit
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
                                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bill Details */}
                <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-bold mb-4">Bill Details</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between font-medium text-zinc-600 dark:text-zinc-400">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between font-medium text-zinc-600 dark:text-zinc-400">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total to Pay</span>
                            <span className="text-primary">₹{total}</span>
                        </div>
                    </div>
                </section>

                {/* Note */}
                <div className="bg-orange-50 dark:bg-primary/5 rounded-2xl p-4 flex gap-3 text-orange-800 dark:text-orange-200 border border-orange-100 dark:border-primary/20">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">By placing this order, you agree to our strict T+1 delivery policy. Freshly prepared meals cannot be canceled once accepted.</p>
                </div>

            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800 p-4 z-40">
                <div className="container mx-auto max-w-2xl flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total</span>
                        <span className="text-xl font-bold">₹{total}</span>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-grow max-w-xs bg-primary hover:bg-primary-dark text-white rounded-2xl py-4 font-bold text-lg transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isProcessing ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Confirm & Pay <CheckCircle className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
