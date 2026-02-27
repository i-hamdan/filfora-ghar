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

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/hero-bg.png"
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
                <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 drop-shadow-md">
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
                        <span className="text-primary">Filfora Ghar</span>
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
