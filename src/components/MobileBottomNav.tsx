"use client";

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { siteConfig } from "@/lib/config";
import {
    Home, ShoppingBag, User,
    Store, ShoppingCart, UserCircle,
    LayoutGrid, Package, UserRound,
    Tent, ShoppingBasket, Smile,
    Building2, Archive, Contact,
    Circle, Square, Triangle,
    MapPin, Gift, Heart,
    ChefHat, Utensils, UserCheck,
    Compass, Wallet, Fingerprint,
    Map as MapIcon, Ticket, Sun,
    Coffee, CreditCard, Sparkles,
    Hexagon, Box
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

export function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { items } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Calculate total cart items
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    // Select Icons based on Central Config Theme
    type IconThemeType = "outline" | "filled" | "dynamic";
    const iconSets: Record<number, { home: any, cart: any, profile: any, type: IconThemeType }> = {
        // Outline Themes
        1: { home: Home, cart: ShoppingBag, profile: User, type: "outline" },
        2: { home: Store, cart: ShoppingCart, profile: UserCircle, type: "outline" },
        3: { home: LayoutGrid, cart: Package, profile: UserRound, type: "outline" },
        4: { home: Tent, cart: ShoppingBasket, profile: Smile, type: "outline" },
        5: { home: Building2, cart: Archive, profile: Contact, type: "outline" },

        // Filled Themes
        6: { home: Home, cart: ShoppingBag, profile: User, type: "filled" },
        7: { home: Store, cart: ShoppingCart, profile: UserCircle, type: "filled" },
        8: { home: LayoutGrid, cart: Package, profile: UserRound, type: "filled" },
        9: { home: Circle, cart: Square, profile: Triangle, type: "filled" },
        10: { home: MapPin, cart: Gift, profile: Heart, type: "filled" },

        // Dynamic Themes (Outline when inactive, Filled when active)
        11: { home: Home, cart: ShoppingBag, profile: User, type: "dynamic" },
        12: { home: Store, cart: ShoppingCart, profile: UserCircle, type: "dynamic" },
        13: { home: LayoutGrid, cart: Package, profile: UserRound, type: "dynamic" },
        14: { home: Tent, cart: ShoppingBasket, profile: Smile, type: "dynamic" },
        15: { home: Building2, cart: Archive, profile: Contact, type: "dynamic" },

        // Creative Dynamic Themes
        16: { home: ChefHat, cart: Utensils, profile: User, type: "dynamic" },
        17: { home: Compass, cart: Wallet, profile: Fingerprint, type: "dynamic" },
        18: { home: MapIcon, cart: Ticket, profile: Sun, type: "dynamic" },
        19: { home: Coffee, cart: CreditCard, profile: Sparkles, type: "dynamic" },
        20: { home: Hexagon, cart: Box, profile: Triangle, type: "dynamic" },
    };

    const themeConfig = iconSets[siteConfig.BOTTOM_NAV_ICON_THEME as keyof typeof iconSets] || iconSets[11];
    const icons = themeConfig;

    const navItems = [
        {
            id: 'home',
            label: 'Order',
            icon: icons.home,
            path: '/',
            action: () => router.push('/'),
        },
        {
            id: 'cart',
            label: 'Cart',
            icon: icons.cart,
            path: '/cart',
            action: () => router.push('/cart'),
            badge: count > 0 ? count : null,
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: icons.profile,
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
                                        fill={(themeConfig.type === "filled" || (themeConfig.type === "dynamic" && isActive)) ? "currentColor" : "none"}
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
