"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { AuthModal } from "./AuthModal";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
    // --- Logo Configuration ---
    const NAVBAR_LOGO_WIDTH = 120;
    const NAVBAR_LOGO_HEIGHT = 40;
    const NAVBAR_LOGO_CUSTOM_HEIGHT_CLASS = "h-12"; // Adjust this Tailwind class to scale visually
    const NAVBAR_LOGO_ROUNDNESS = "rounded-xl"; // e.g., rounded-md, rounded-xl, rounded-full
    // -------------------------

    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled ? "glass py-3 text-zinc-900 dark:text-zinc-100" : "bg-transparent py-5 text-zinc-900 dark:text-zinc-100"
                )}
            >
                <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/assets/filfora_ghar_small.png"
                            alt="Filfora Ghar Logo"
                            width={NAVBAR_LOGO_WIDTH}
                            height={NAVBAR_LOGO_HEIGHT}
                            className={`object-cover w-auto overflow-hidden mix-blend-multiply dark:mix-blend-screen bg-white ${NAVBAR_LOGO_CUSTOM_HEIGHT_CLASS} ${NAVBAR_LOGO_ROUNDNESS}`}
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="#menu" className="hover:text-primary transition-colors drop-shadow-sm">
                            Menu
                        </Link>
                        <Link href="#about" className="hover:text-primary transition-colors drop-shadow-sm">
                            Our Story
                        </Link>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    router.push("/profile");
                }}
            />
        </>
    );
}
