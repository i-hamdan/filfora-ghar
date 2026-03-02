"use client";

import { useAdminStore } from "@/store/useAdminStore";

export default function AdminDashboard() {
    const { adminEmail } = useAdminStore();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black title-font">Admin Dashboard</h1>
                <p className="text-zinc-500 mt-2">Welcome back, <span className="text-zinc-300 font-semibold">{adminEmail}</span>. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-zinc-400 font-semibold mb-2">Pending Orders</h3>
                    <p className="text-4xl font-black text-white">0</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-zinc-400 font-semibold mb-2">Active Menu Items</h3>
                    <p className="text-4xl font-black text-white">0</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-zinc-400 font-semibold mb-2">Today's Revenue</h3>
                    <p className="text-4xl font-black text-primary">₹0</p>
                </div>
            </div>

            <div className="mt-12 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">👋</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Dashboard Initialized</h2>
                <p className="text-zinc-500 max-w-md">
                    Use the sidebar to navigate to the Menu Manager to start adding your categories and food items into the database.
                </p>
            </div>
        </div>
    );
}
