"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import {
    ChevronLeft,
    Package,
    MapPin,
    Clock,
    MessageCircle,
    CheckCircle2,
    Circle,
    ArrowLeft,
    Receipt,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && user && id) {
            fetchOrderDetails();
        }
    }, [mounted, user, id]);

    const fetchOrderDetails = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                addresses (*),
                order_items (
                    *,
                    menu_items (*)
                )
            `)
            .eq('id', id)
            .single();

        if (!error && data) {
            setOrder(data);
        }
        setIsLoading(false);
    };

    if (!mounted || !isAuthenticated) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4 text-center">
                <Package className="w-16 h-16 text-zinc-300 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                <p className="text-zinc-500 mb-8">We couldn't find the details for this order.</p>
                <Link href="/profile" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20">
                    Back to Profile
                </Link>
            </div>
        );
    }

    const subtotal = order.order_items.reduce((sum: number, item: any) => sum + (item.price_at_time_of_order * item.quantity), 0);
    const deliveryFee = 50;
    const total = order.total_amount;

    const stages = [
        { key: 'pending', label: 'Confirmed', icon: CheckCircle2 },
        { key: 'preparing', label: 'Preparing', icon: Clock },
        { key: 'delivered', label: 'Delivered', icon: Package }
    ];

    const currentStageIndex = stages.findIndex(s => s.key === order.status);
    const orderIdShort = order.id.split('-')[0].toUpperCase();

    return (
        <div className="bg-zinc-50 dark:bg-black min-h-screen pb-24">
            {/* Header */}
            <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-40 pt-16 pb-4 px-4">
                <div className="container mx-auto max-w-2xl flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black title-font">Order #FLF-{orderIdShort}</h1>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-2xl px-4 mt-8 space-y-6">

                {/* Status Tracker */}
                <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden relative">
                    <div className="flex justify-between relative z-10">
                        {stages.map((stage, index) => {
                            const Icon = stage.icon;
                            const isActive = index <= currentStageIndex;
                            const isCurrent = index === currentStageIndex;

                            return (
                                <div key={stage.key} className="flex flex-col items-center gap-3 relative">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                        isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                    )}>
                                        <Icon className={cn("w-6 h-6", isCurrent && "animate-pulse")} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                                        isActive ? "text-primary" : "text-zinc-400"
                                    )}>
                                        {stage.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Progress Line Background */}
                    <div className="absolute top-[4.25rem] left-16 right-16 h-1 bg-zinc-100 dark:bg-zinc-800 -z-0" />
                    {/* Active Progress Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-[4.25rem] left-16 right-16 h-1 bg-primary -z-0 origin-left"
                    />
                </section>

                {/* Items List */}
                <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                        <Receipt className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold">Order Items</h2>
                    </div>

                    <div className="space-y-6">
                        {order.order_items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center group">
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 shadow-sm transition-transform group-hover:scale-105">
                                        <Image
                                            src={item.menu_items?.image_url || '/placeholder.png'}
                                            alt={item.menu_items?.name || 'Item'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">{item.menu_items?.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-[10px] font-black text-zinc-500 uppercase">
                                                Qty: {item.quantity}
                                            </span>
                                            <span className="text-sm font-medium text-zinc-500">
                                                × ₹{item.price_at_time_of_order}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className="font-black text-lg text-zinc-900 dark:text-zinc-100">
                                    ₹{item.price_at_time_of_order * item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Delivery Address */}
                <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold">Delivery Address</h2>
                    </div>
                    <div className="p-5 bg-zinc-50 dark:bg-black/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">
                                {order.addresses?.tag || 'Home'}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                            {order.addresses?.details}
                        </p>
                    </div>
                </section>

                {/* Bill Details */}
                <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-bold text-lg mb-6">Bill Summary</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between font-bold text-zinc-500 dark:text-zinc-500">
                            <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                            <span className="text-zinc-900 dark:text-zinc-100">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between font-bold text-zinc-500 dark:text-zinc-500">
                            <span className="uppercase tracking-widest text-[10px]">Delivery Fee</span>
                            <span className="text-zinc-900 dark:text-zinc-100">₹{deliveryFee}</span>
                        </div>
                        <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="uppercase tracking-widest text-[10px] font-black text-primary">Total Paid</span>
                                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">INR {total}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-500/20">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Paid via QR</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Support Action */}
                <button
                    onClick={() => window.open('https://wa.me/919800454222', '_blank')}
                    className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                    <MessageCircle className="w-6 h-6" /> Need help with this order?
                </button>

            </main>
        </div>
    );
}
