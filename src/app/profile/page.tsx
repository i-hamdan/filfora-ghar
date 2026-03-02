"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, MapPin, Package, Settings, User as UserIcon, CheckCircle2, Phone, Mail, Edit3, ArrowRight, Star, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Address {
    id: string;
    tag: string;
    details: string;
}

const initialAddresses: Address[] = [
    {
        id: "1",
        tag: "Home",
        details: "123, Residency Road, Near Lake Post,\nBangalore - 560025",
    }
];

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Address State
    const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
    const [defaultAddressId, setDefaultAddressId] = useState<string>("1");
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({ tag: "", details: "" });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/");
        }
    }, [mounted, isAuthenticated, router]);

    if (!mounted || !user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <div className="bg-zinc-50 dark:bg-black min-h-screen pt-24 pb-6 md:pb-8 transition-colors">
            {/* Background Header Graphic */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/20 to-transparent dark:from-primary/10 pointer-events-none -z-10" />

            <div className="container mx-auto px-4 max-w-5xl space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div className="flex items-end gap-6">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-950 shadow-xl flex items-center justify-center text-primary z-10 overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.full_name || 'User'}&backgroundColor=facc15`}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="pb-2">
                            <h1 className="text-3xl md:text-5xl font-black title-font tracking-tight text-zinc-900 dark:text-zinc-50">
                                {user.full_name || 'Guest User'}
                            </h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-zinc-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
                                    <Phone className="w-3.5 h-3.5" /> +91 {user.phone}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all font-bold shadow-sm w-full md:w-auto"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                    {/* Left Column (Address & Details) */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* Saved Addresses Card */}
                        <div className="bg-white dark:bg-zinc-900/80 rounded-[2rem] p-6 sm:p-8 shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black title-font flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-primary" /> Addresses
                                </h3>
                                <button
                                    onClick={() => alert("Edit Address functionality coming soon!")}
                                    className="p-2 text-zinc-400 hover:text-primary transition-colors"
                                >
                                    <Edit3 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`group relative overflow-hidden p-5 border-2 rounded-2xl transition-colors ${defaultAddressId === address.id
                                            ? "border-primary/20 dark:border-primary/30 bg-primary/5"
                                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                            }`}
                                    >
                                        {defaultAddressId === address.id && (
                                            <div className="absolute top-0 right-0 p-3">
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 rounded-md">
                                                {address.tag}
                                            </span>
                                            {defaultAddressId !== address.id && (
                                                <button
                                                    onClick={() => setDefaultAddressId(address.id)}
                                                    className="text-xs font-bold text-primary hover:underline"
                                                >
                                                    Set default
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line mt-2">
                                            {address.details}
                                        </p>
                                    </div>
                                ))}

                                {isAdding ? (
                                    <div className="p-5 border-2 border-primary/30 rounded-2xl bg-white dark:bg-zinc-900 space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Tag (e.g., Work)"
                                            className="w-full text-sm p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            value={newAddress.tag}
                                            onChange={(e) => setNewAddress({ ...newAddress, tag: e.target.value })}
                                        />
                                        <textarea
                                            placeholder="Full Address"
                                            className="w-full text-sm p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                                            value={newAddress.details}
                                            onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
                                        />
                                        <div className="flex gap-2 justify-end pt-2">
                                            <button
                                                onClick={() => setIsAdding(false)}
                                                className="px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (newAddress.tag && newAddress.details) {
                                                        const id = Date.now().toString();
                                                        setAddresses([...addresses, { id, ...newAddress }]);
                                                        setIsAdding(false);
                                                        setNewAddress({ tag: "", details: "" });
                                                        setDefaultAddressId(id);
                                                    }
                                                }}
                                                className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="w-full py-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary dark:hover:border-primary hover:bg-primary/5 rounded-2xl font-bold transition-all text-sm text-zinc-500 hover:text-primary flex items-center justify-center gap-2"
                                    >
                                        + Add New Address
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Orders) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-zinc-900/80 rounded-[2rem] p-6 sm:p-8 shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black title-font flex items-center gap-2">
                                    <Package className="w-7 h-7 text-primary" /> Recent Orders
                                </h3>
                                <button className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                                    View All <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Active Order */}
                                <div className="relative overflow-hidden p-6 border-2 border-zinc-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-[1.5rem] bg-white dark:bg-zinc-900 transition-all group shadow-sm hover:shadow-md">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="font-black text-lg">Order #FLF-1003</span>
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 rounded-full text-xs font-black uppercase tracking-wider">
                                                    Preparing
                                                </span>
                                            </div>
                                            <p className="font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                                2x Classic Chicken Biryani, 1x Raita, 1x Coke (750ml)
                                            </p>
                                            <p className="text-sm font-semibold text-zinc-500">
                                                Ordered on: 12th Oct 2026
                                            </p>
                                        </div>
                                        <div className="text-left sm:text-right flex flex-col justify-between">
                                            <p className="font-black text-2xl text-primary">₹850</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Past Order */}
                                <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-900/50 opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="font-black text-lg">Order #FLF-0982</span>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-full text-xs font-black uppercase tracking-wider">
                                                    Delivered
                                                </span>
                                            </div>
                                            <p className="font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                                1x Mutton Nalli Nihari, 4x Garlic Naan
                                            </p>
                                            <p className="text-sm font-semibold text-zinc-500">
                                                Delivered on: 12th Oct 2026
                                            </p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="font-black text-2xl">₹920</p>
                                            <button className="text-sm font-bold text-zinc-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors mt-2 sm:mt-4 inline-block">
                                                Reorder Items
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
