"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export function Hero() {
    const { items } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Customize logo dimensions and appearance
    const HERO_LOGO_WIDTH = 280;
    const HERO_LOGO_HEIGHT = 80;
    const HERO_LOGO_CLASSES = "object-contain h-36 md:h-24 w-auto drop-shadow-xl mt-2";

    const bgImages = {
        1: "/hero-bg.png",
        2: "/assets/hero_bg_dark_moody.png",
        3: "/assets/hero_bg_bright_marble.png"
    };

    const textColors: Record<number, string> = {
        1: "text-primary",       // Original Orange
        2: "text-white",         // Pure White
        3: "text-black",         // Pure Black
        4: "text-red-500",       // Red
        5: "text-orange-400",    // Light Orange
        6: "text-amber-400",     // Amber
        7: "text-yellow-400",    // Yellow
        8: "text-lime-400",      // Lime
        9: "text-green-500",     // Green
        10: "text-emerald-400",  // Emerald
        11: "text-teal-400",     // Teal
        12: "text-cyan-400",     // Cyan
        13: "text-sky-400",      // Sky Blue
        14: "text-blue-500",     // Blue
        15: "text-indigo-400",   // Indigo
        16: "text-violet-400",   // Violet
        17: "text-purple-500",   // Purple
        18: "text-fuchsia-400",  // Fuchsia
        19: "text-pink-400",     // Pink
        20: "text-rose-500",     // Rose
        21: "text-zinc-300"      // Light Gray/Silver
    };

    // Safely get the selected color class or fallback to primary
    const dynamicTextColor = textColors[siteConfig.HERO_TEXT_COLOR] || "text-primary";

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src={bgImages[siteConfig.HERO_BG_STYLE]}
                    alt="Filfora Ghar Signature Dishes"
                    fill
                    className="object-cover object-center scale-105 animate-slow-zoom"
                    priority
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-16">
                <span className={`font-semibold tracking-wider uppercase text-sm mb-4 drop-shadow-md ${dynamicTextColor}`}>
                    Authentic Home Kitchen
                </span>
                {siteConfig.USE_IMAGE_LOGO_IN_HERO ? (
                    <div className="flex flex-col items-center mb-6">
                        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                            Welcome to
                        </h2>
                        <Image
                            src="/assets/filfora_ghar_small.png"
                            alt="Filfora Ghar Logo"
                            width={HERO_LOGO_WIDTH}
                            height={HERO_LOGO_HEIGHT}
                            className={HERO_LOGO_CLASSES}
                        />
                    </div>
                ) : (
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Welcome to <br />
                        <span className={dynamicTextColor}>Filfora Ghar</span>
                    </h1>
                )}
                <p className="text-lg md:text-xl text-zinc-200 mb-10 max-w-2xl font-light drop-shadow-md">
                    Experience the warmth of home-cooked meals by Chef Asif Rasheed.
                    Rich flavors, premium ingredients, and a taste you will never forget.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        href="#menu"
                        className="group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                    >
                        Explore Menu
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    {mounted && cartCount > 0 && (
                        <Link
                            href="/cart"
                            className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Resume Checkout ({cartCount})
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
