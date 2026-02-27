"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { ChevronLeft, Calendar as CalendarIcon, MapPin, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Helper to get dates starting from Tomorrow (T+1)
const getUpcomingDates = (daysCount = 7) => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= daysCount; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push(nextDate);
    }
    return dates;
};

export default function DeliveryPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { items } = useCartStore();
    const [mounted, setMounted] = useState(false);

    const [availableDates] = useState(() => getUpcomingDates());
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedAddressMode, setSelectedAddressMode] = useState<"saved" | "new">("saved");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && (!isAuthenticated || items.length === 0)) {
            router.push("/");
        }
    }, [mounted, isAuthenticated, items.length, router]);

    if (!mounted || !isAuthenticated || items.length === 0) return null;

    return (
        <div className="bg-zinc-50 dark:bg-black min-h-screen pb-24">
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-30 pt-16 pb-4 px-4 shadow-sm">
                <div className="container mx-auto max-w-2xl flex items-center justify-between">
                    <Link href="/" className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold title-font">Delivery Details</h1>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>
            </header>

            <main className="container mx-auto max-w-2xl px-4 mt-8 space-y-10">

                {/* Date Selection */}
                <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CalendarIcon className="w-4 h-4" />
                        </div>
                        <h2 className="text-xl font-bold">When do you want it?</h2>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                        We prepare fresh meals to order. We only accept orders for tomorrow onwards.
                    </p>

                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar -mx-2 px-2">
                        {availableDates.map((date, index) => {
                            const isSelected = index === selectedDateIndex;
                            const isTomorrow = index === 0;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDateIndex(index)}
                                    className={cn(
                                        "flex-shrink-0 w-24 h-28 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1",
                                        isSelected
                                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                                            : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800"
                                    )}
                                >
                                    <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                                        {isTomorrow ? "Tomorrow" : date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="text-3xl font-bold title-font">{date.getDate()}</span>
                                    <span className="text-xs font-medium opacity-80">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Address Selection */}
                <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <h2 className="text-xl font-bold">Where to deliver?</h2>
                    </div>

                    <div className="space-y-4">
                        <div
                            onClick={() => setSelectedAddressMode("saved")}
                            className={cn(
                                "p-5 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 items-start",
                                selectedAddressMode === "saved"
                                    ? "border-primary bg-primary/5"
                                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                            )}
                        >
                            <div className="mt-0.5">
                                <CheckCircle2 className={cn("w-5 h-5 transition-colors", selectedAddressMode === "saved" ? "text-primary fill-primary/20" : "text-zinc-300")} />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">Home</span>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
                                    123, Residency Road, Near Lake Post, Bangalore - 560025
                                </p>
                            </div>
                        </div>

                        <div
                            onClick={() => setSelectedAddressMode("new")}
                            className={cn(
                                "p-5 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 items-center",
                                selectedAddressMode === "new"
                                    ? "border-primary bg-primary/5"
                                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                            )}
                        >
                            <div>
                                <CheckCircle2 className={cn("w-5 h-5 transition-colors", selectedAddressMode === "new" ? "text-primary fill-primary/20" : "text-zinc-300")} />
                            </div>
                            <span className="font-semibold">Add New Address</span>
                        </div>

                        {selectedAddressMode === "new" && (
                            <div className="mt-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-4 border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4">
                                <input type="text" placeholder="Flat, House no., Building, Company" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm" />
                                <input type="text" placeholder="Area, Street, Sector, Village" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm" />
                                <div className="flex gap-4">
                                    <input type="text" placeholder="Landmark" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm" />
                                    <input type="text" placeholder="Pincode" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm" />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800 p-4 z-40">
                <div className="container mx-auto max-w-2xl">
                    <button
                        onClick={() => router.push("/checkout/review")}
                        className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-4 font-bold text-lg transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Review Order
                    </button>
                </div>
            </div>
        </div>
    );
}
