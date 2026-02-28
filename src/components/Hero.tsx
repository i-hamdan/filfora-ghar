import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    // --- Hero Logo Configuration ---
    // Set to true to use the image logo, false to use the text logo
    const USE_IMAGE_LOGO_IN_HERO = false;

    // Customize logo dimensions and appearance
    const HERO_LOGO_WIDTH = 280;
    const HERO_LOGO_HEIGHT = 80;
    const HERO_LOGO_CLASSES = "object-contain h-36 md:h-24 w-auto drop-shadow-xl mt-2";
    // -------------------------------

    // --- Hero Background Configuration ---
    // Change this variable to toggle between different background styles:
    // 1 = Original (Dark/Orange focus)
    // 2 = Dark Moody (Cinematic, rustic wooden table, rich Mughlai colors)
    // 3 = Bright Marble (Elegant, sunlit, clean marble table)
    const HERO_BG_STYLE: 1 | 2 | 3 = 1;
    // const HERO_BG_STYLE: 1 | 2 | 3 = 2;
    // const HERO_BG_STYLE: 1 | 2 | 3 = 3;

    const bgImages = {
        1: "/hero-bg.png",
        2: "/assets/hero_bg_dark_moody.png",
        3: "/assets/hero_bg_bright_marble.png"
    };
    // -----------------------------------

    // --- Hero Text Color Configuration ---
    // Change this variable (1-21) to select a different color for "Authentic Home Kitchen" and "Filfora Ghar"
    // Option 1 is the default brand orange (text-primary)
    // Options 2-21 are vibrant tailwind colors
    const HERO_TEXT_COLOR: number = 7;

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
    const dynamicTextColor = textColors[HERO_TEXT_COLOR] || "text-primary";
    // -------------------------------------

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src={bgImages[HERO_BG_STYLE]}
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
                {USE_IMAGE_LOGO_IN_HERO ? (
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
                <Link
                    href="#menu"
                    className="group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                >
                    Explore Menu
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    );
}
