"use client";

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Home, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

export function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { items, openCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Calculate total cart items
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    const navItems = [
        {
            id: 'home',
            label: 'Order',
            icon: Home,
            path: '/',
            action: () => router.push('/'),
        },
        {
            id: 'cart',
            label: 'Cart',
            icon: ShoppingBag,
            action: openCart,
            badge: count > 0 ? count : null,
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
            path: '/profile',
            action: () => {
                if (isAuthenticated) {
                    router.push('/profile');
                } else {
                    setIsAuthModalOpen(true);
                }
            },
        },
    ];

    return (
        <>
            <div className="md:hidden fixed bottom-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-200/50 dark:border-zinc-800/50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
                <nav className="flex items-center justify-around px-2 min-h-[5.5rem] relative">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <motion.button
                                key={item.id}
                                whileTap={{ scale: 0.85 }}
                                onClick={item.action}
                                className={cn(
                                    "relative flex flex-col items-center justify-center w-full h-full py-2 gap-1.5 transition-colors duration-300",
                                    isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                )}
                            >
                                <div className="relative">
                                    <Icon className={cn(
                                        "w-[26px] h-[26px] transition-transform duration-300",
                                        isActive && "scale-110"
                                    )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />

                                    {/* Animated Cart Badge */}
                                    {item.badge !== null && item.badge !== undefined && (
                                        <motion.span
                                            key={item.badge}
                                            initial={{ scale: 1.5, rotate: 15 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-red-500 border border-white dark:border-zinc-950 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                                        >
                                            {item.badge}
                                        </motion.span>
                                    )}
                                </div>

                                <span className={cn(
                                    "text-[10px] font-medium tracking-wide transition-all duration-300",
                                    isActive ? "opacity-100" : "opacity-80"
                                )}>
                                    {item.label}
                                </span>

                                {/* Active Tab Indicator Dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavDot"
                                        className="absolute bottom-0 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </nav>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
