"use client";

import { CheckCircle2, Clock, Search, Filter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mockOrders = [
    { id: "FLF-1001", customer: "Asif Rasheed", phone: "+91 9876543210", items: "2x Nalli Nihari, 4x Naan", total: "₹1,250", status: "pending", date: "T+1 (Tom)" },
    { id: "FLF-1002", customer: "Sara Khan", phone: "+91 9876543211", items: "1x Chicken Biryani, 1x Raita", total: "₹550", status: "preparing", date: "T+1 (Tom)" },
    { id: "FLF-1003", customer: "Faizan Ahmed", phone: "+91 9876543212", items: "2x Mutton Korma", total: "₹900", status: "completed", date: "Today" },
];

export default function AdminOrders() {
    const [filterMode, setFilterMode] = useState("all");

    const filteredOrders = filterMode === "all"
        ? mockOrders
        : mockOrders.filter(o => o.status === filterMode);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold title-font text-zinc-900 dark:text-zinc-100">Orders</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage and track incoming orders.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <button className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <Filter className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {["all", "pending", "preparing", "completed", "cancelled"].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterMode(status)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-colors",
                            filterMode === status
                                ? "bg-primary text-white"
                                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        )}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
                                <th className="p-4 font-bold">Order ID</th>
                                <th className="p-4 font-bold">Customer</th>
                                <th className="p-4 font-bold">Items</th>
                                <th className="p-4 font-bold">Total</th>
                                <th className="p-4 font-bold">Delivery</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, i) => (
                                <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors last:border-0">
                                    <td className="p-4 font-bold text-sm">{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{order.customer}</div>
                                        <div className="text-xs text-zinc-500">{order.phone}</div>
                                    </td>
                                    <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate">{order.items}</td>
                                    <td className="p-4 font-bold text-sm">{order.total}</td>
                                    <td className="p-4 text-sm font-medium">{order.date}</td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5",
                                            order.status === 'pending' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                                            order.status === 'preparing' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                            order.status === 'completed' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        )}>
                                            {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                            {order.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-primary hover:text-primary-dark font-medium text-sm transition-colors">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12 text-zinc-500">
                            No orders found for this status.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
