"use client";

import { CheckCircle2, Home, Package, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-2xl border border-zinc-100 dark:border-zinc-800 text-center"
            >
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-500">
                    <CheckCircle2 className="w-12 h-12" />
                </div>

                <h1 className="text-3xl font-bold title-font mb-2">Order Confirmed!</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8">
                    Your order #FLF-1003 has been successfully placed. We are preparing it fresh for tomorrow.
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8 text-left flex gap-4">
                    <MessageCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">WhatsApp Confirmation</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">We've sent your order details to your registered WhatsApp number.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/profile"
                        className="flex-1 py-3.5 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        <Package className="w-5 h-5" /> View Order
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" /> Back Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
