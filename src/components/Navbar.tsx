"use client";

import Link from "next/link";
import { ShoppingCart, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CartDrawer } from "./CartDrawer";
import { ThemeToggle } from "./ThemeToggle";
import { AuthModal } from "./AuthModal";
import { useRouter } from "next/navigation";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { items, isOpen, openCart, closeCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
                        {/* We can add an image logo later */}
                        <span className="text-2xl font-bold tracking-tight text-primary drop-shadow-sm">
                            Filfora
                        </span>
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
                        <button
                            onClick={openCart}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative"
                        >
                            <ShoppingCart className="w-5 h-5 drop-shadow-sm" />
                            {mounted && cartItemsCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>
                        {isAuthenticated ? (
                            <Link
                                href="/profile"
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <User className="w-5 h-5 drop-shadow-sm" />
                            </Link>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <User className="w-5 h-5 drop-shadow-sm" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <CartDrawer
                isOpen={isOpen}
                onClose={closeCart}
            />
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
