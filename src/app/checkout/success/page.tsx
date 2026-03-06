"use client";

import { CheckCircle2, Package, Sparkles } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Generate confetti particles once
function generateConfetti(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.5 + Math.random() * 1.5,
        size: 6 + Math.random() * 8,
        color: [
            "#f97316", "#22c55e", "#3b82f6", "#eab308", "#ec4899",
            "#8b5cf6", "#14b8a6", "#f43f5e", "#06b6d4", "#a855f7"
        ][i % 10],
        rotation: Math.random() * 360,
    }));
}

export default function OrderSuccessPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [countdown, setCountdown] = useState(4);
    const confetti = useMemo(() => generateConfetti(40), []);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-redirect countdown
    useEffect(() => {
        if (!mounted) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/profile#orders-section");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [mounted, router]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-4 overflow-hidden relative">
            {/* Confetti */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {confetti.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{ y: -20, x: `${particle.x}vw`, opacity: 1, rotate: 0 }}
                        animate={{
                            y: "110vh",
                            rotate: particle.rotation + 720,
                            opacity: [1, 1, 0],
                        }}
                        transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            ease: "linear",
                        }}
                        className="absolute top-0"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            borderRadius: particle.id % 3 === 0 ? "50%" : particle.id % 3 === 1 ? "2px" : "0",
                        }}
                    />
                ))}
            </div>

            {/* Radial glow */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-green-500/20 via-green-500/5 to-transparent pointer-events-none"
            />

            {/* Main Card */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 150, delay: 0.1 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-2xl border border-zinc-100 dark:border-zinc-800 text-center relative z-10"
            >
                {/* Animated Checkmark */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.3 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                    >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <h1 className="text-3xl font-bold title-font">Order Placed!</h1>
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8">
                        Your fresh meal is being prepared with love. We&apos;ll have it ready for you!
                    </p>
                </motion.div>

                {/* Success Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl p-4 mb-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-green-800 dark:text-green-300 text-sm">WhatsApp Confirmation Sent</p>
                            <p className="text-xs text-green-700 dark:text-green-400/80">Check your registered number for order details.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Auto-redirect notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col items-center gap-3"
                >
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                        Taking you to your orders in {countdown}s...
                    </p>
                    <button
                        onClick={() => router.push("/profile#orders-section")}
                        className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <Package className="w-5 h-5" /> View My Orders
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
