import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-zinc-900 text-zinc-400 py-12 mt-20">
            <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Filfora Ghar</h3>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Authentic, mouth-watering home-cooked meals by Asif Rasheed. Order today for a delightful experience tomorrow.
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
