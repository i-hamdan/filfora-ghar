"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, MapPin, Package, Settings, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/");
        }
    }, [mounted, isAuthenticated, router]);

    if (!mounted || !isAuthenticated || !user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <div className="container mx-auto px-4 max-w-4xl py-28 min-h-screen">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-bold title-font">My Profile</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Sidebar/Details */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <UserIcon className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold mb-1">{user.full_name}</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">+91 {user.phone}</p>

                        <button className="mt-6 w-full py-2.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                            <Settings className="w-4 h-4" /> Edit Details
                        </button>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-zinc-400" />Saved Addresses
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">Home</span>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300">123, Residency Road, Near Lake Post, Bangalore - 560025</p>
                            </div>
                            <button className="w-full py-3 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary hover:text-primary rounded-2xl font-medium transition-colors text-sm text-zinc-500 dark:text-zinc-400">
                                + Add New Address
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content (Orders) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <Package className="w-6 h-6 text-primary" /> Order History
                        </h3>

                        {/* Mock Order List */}
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-5 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold">Order #FLF-100{i}</span>
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                                                {i === 1 ? 'Out for Delivery' : 'Delivered'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">2x Mutton Nalli Nihari, 4x Garlic Naan</p>
                                        <p className="text-xs text-zinc-400 mt-1">Ordered on: 12th Oct 2026</p>
                                    </div>
                                    <div className="text-left sm:text-right mt-2 sm:mt-0 w-full sm:w-auto">
                                        <p className="font-bold text-lg">₹{(1340 - (i * 200))}</p>
                                        <button className="text-primary text-sm font-medium hover:underline mt-1">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
