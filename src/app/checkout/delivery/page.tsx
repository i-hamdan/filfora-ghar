"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

import { ChevronLeft, Calendar as CalendarIcon, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
    const { user, isAuthenticated, isAuthReady } = useAuthStore();
    const { items, setCheckoutDetails } = useCartStore();
    const [mounted, setMounted] = useState(false);

    const [availableDates] = useState(() => getUpcomingDates());
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);

    // Address State
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
    const [isFetchingAddresses, setIsFetchingAddresses] = useState(true);
    const [addressFetchError, setAddressFetchError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // New Address Form State
    const [newAddress, setNewAddress] = useState({
        type: "Home",
        street_address: "",
        build_floor_apt: "",
        area_locality: "",
        delivery_instructions: ""
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && isAuthReady && (!isAuthenticated || items.length === 0)) {
            router.push("/");
        } else if (mounted && isAuthReady && user) {
            fetchAddresses();
        }
    }, [mounted, isAuthenticated, isAuthReady, items.length, user, router]);

    const fetchAddresses = async () => {
        setIsFetchingAddresses(true);
        setAddressFetchError(false);
        try {
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Address fetch timed out")), 8000)
            );
            const fetchPromise = Promise.resolve(
                supabase.from('addresses').select('*').eq('user_id', user!.id).order('is_default', { ascending: false }).order('created_at', { ascending: false })
            );
            const { data } = await Promise.race([fetchPromise, timeoutPromise]) as any;
            if (data && data.length > 0) {
                setAddresses(data);
                // Auto-select the default or first address
                setSelectedAddressId(data[0].id);
            } else {
                setSelectedAddressId("new");
            }
        } catch (err) {
            console.error("Failed to fetch addresses:", err);
            setAddressFetchError(true);
            setSelectedAddressId("new");
        } finally {
            setIsFetchingAddresses(false);
        }
    };

    const handleContinue = async () => {
        const deliveryDate = availableDates[selectedDateIndex].toISOString().split('T')[0];

        if (selectedAddressId === "new") {
            if (!newAddress.street_address || !newAddress.area_locality) {
                alert("Please fill in the required address fields (Street Address & Area).");
                return;
            }

            setIsProcessing(true);
            const isFirst = addresses.length === 0;
            const mappedDetails = `${newAddress.build_floor_apt ? newAddress.build_floor_apt + ', ' : ''}${newAddress.street_address}\n${newAddress.area_locality}${newAddress.delivery_instructions ? '\nNote: ' + newAddress.delivery_instructions : ''}`;

            const { data, error } = await supabase.from('addresses').insert({
                user_id: user!.id,
                tag: newAddress.type,
                details: mappedDetails,
                is_default: isFirst
            }).select().single();

            if (error || !data) {
                alert("Error saving address. Please try again.");
                setIsProcessing(false);
                return;
            }

            setCheckoutDetails({ date: deliveryDate, addressId: data.id });
            router.push("/checkout/review");
        } else {
            setCheckoutDetails({ date: deliveryDate, addressId: selectedAddressId });
            router.push("/checkout/review");
        }
    };

    if (!mounted || !isAuthReady || !isAuthenticated || items.length === 0) return null;

    return (
        <div className="bg-zinc-50 dark:bg-black min-h-screen pb-48 md:pb-32">
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-30 pt-16 pb-4 px-4 shadow-sm">
                <div className="container mx-auto max-w-2xl flex items-center justify-between">
                    <Link href="/" className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold title-font">Delivery Details</h1>
                    <div className="w-10"></div>
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

                    {isFetchingAddresses ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : addressFetchError ? (
                        <div className="text-center py-8 space-y-3">
                            <p className="text-sm text-red-500 font-medium">Failed to load addresses.</p>
                            <button onClick={fetchAddresses} className="text-sm font-bold text-primary hover:underline">Try Again</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    onClick={() => setSelectedAddressId(address.id)}
                                    className={cn(
                                        "p-5 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 items-start",
                                        selectedAddressId === address.id
                                            ? "border-primary bg-primary/5"
                                            : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                                    )}
                                >
                                    <div className="mt-0.5">
                                        <CheckCircle2 className={cn("w-5 h-5 transition-colors", selectedAddressId === address.id ? "text-primary fill-primary/20" : "text-zinc-300")} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">{address.tag || address.type}</span>
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-line">
                                            {address.details || `${address.street_address}\n${address.area_locality}`}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div
                                onClick={() => setSelectedAddressId("new")}
                                className={cn(
                                    "p-5 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 items-center",
                                    selectedAddressId === "new"
                                        ? "border-primary bg-primary/5"
                                        : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                                )}
                            >
                                <div>
                                    <CheckCircle2 className={cn("w-5 h-5 transition-colors", selectedAddressId === "new" ? "text-primary fill-primary/20" : "text-zinc-300")} />
                                </div>
                                <span className="font-semibold">Add New Address</span>
                            </div>

                            {selectedAddressId === "new" && (
                                <div className="mt-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-4 border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4">
                                    <select
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                                        value={newAddress.type}
                                        onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Building, Floor, Apt (Optional)"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                                        value={newAddress.build_floor_apt}
                                        onChange={(e) => setNewAddress({ ...newAddress, build_floor_apt: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Street Address & Landmark *"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm min-h-[60px]"
                                        value={newAddress.street_address}
                                        onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Area / Locality *"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                                        value={newAddress.area_locality}
                                        onChange={(e) => setNewAddress({ ...newAddress, area_locality: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Delivery Instructions (Optional)"
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                                        value={newAddress.delivery_instructions}
                                        onChange={(e) => setNewAddress({ ...newAddress, delivery_instructions: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800 p-4 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] transition-all">
                <div className="container mx-auto max-w-2xl">
                    <button
                        onClick={handleContinue}
                        disabled={isProcessing}
                        className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl py-4 font-bold text-lg transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Review Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}
