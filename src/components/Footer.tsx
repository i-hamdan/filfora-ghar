"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
    // --- Logo Configuration ---
    const FOOTER_LOGO_WIDTH = 150;
    const FOOTER_LOGO_HEIGHT = 50;
    const FOOTER_LOGO_CUSTOM_HEIGHT_CLASS = "h-30"; // Adjust this Tailwind class to scale visually
    const FOOTER_LOGO_ROUNDNESS = "rounded-xl"; // e.g., rounded-md, rounded-xl, rounded-full
    // -------------------------

    const pathname = usePathname();

    if (pathname.startsWith('/cart') || pathname.startsWith('/checkout') || pathname.startsWith('/profile') || pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-zinc-900 text-zinc-400 py-12 mt-20">
            <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <Image
                        src="/assets/filfora_ghar_small.png"
                        alt="Filfora Ghar Logo"
                        width={FOOTER_LOGO_WIDTH}
                        height={FOOTER_LOGO_HEIGHT}
                        className={`object-contain mb-4 w-auto overflow-hidden opacity-90 ${FOOTER_LOGO_CUSTOM_HEIGHT_CLASS} ${FOOTER_LOGO_ROUNDNESS}`}
                    />
                    <p className="text-sm leading-relaxed max-w-xs">
                        Authentic, mouth-watering home-cooked meals by Chef Asif Rasheed. Order today for a delightful experience tomorrow.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="#menu" className="hover:text-primary transition-colors">Menu</Link>
                        </li>
                        <li>
                            <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
                        </li>
                        <li>
                            <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Contact</h4>
                    <ul className="space-y-2 text-sm">
                        <li>WhatsApp: +91 98765 43210</li>
                        <li>Email: hello@filforaghar.com</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-xs">
                <p>&copy; {new Date().getFullYear()} Filfora Ghar. All rights reserved.</p>
            </div>
        </footer>
    );
}
