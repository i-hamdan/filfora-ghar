"use client";

import { TrendingUp, Users, ShoppingBag, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
    { label: "Today's Orders", value: "12", change: "+2", isUp: true, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Revenue (Today)", value: "₹4,250", change: "+15%", isUp: true, icon: IndianRupee, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Active Customers", value: "148", change: "+5", isUp: true, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Pending Deliveries", value: "8", change: "-2", isUp: false, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export default function AdminOverview() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold title-font text-zinc-900 dark:text-zinc-100">Dashboard Overview</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Here's what's happening today at Filfora Ghar.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                                <span className={`text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Table placeholder */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">
                    No recent activity to show yet.
                </div>
            </div>
        </div>
    );
}
