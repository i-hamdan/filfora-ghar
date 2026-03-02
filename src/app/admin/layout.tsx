"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, ClipboardList, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAdminAuthenticated, isLoading, checkSession, logout, adminEmail } = useAdminStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAdminAuthenticated && !pathname.includes('/admin/login')) {
                router.push('/admin/login');
            }
            if (isAdminAuthenticated && pathname.includes('/admin/login')) {
                router.push('/admin');
            }
        }
    }, [isLoading, isAdminAuthenticated, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    // Hide sidebar on the login page entirely
    if (pathname.includes('/admin/login')) {
        return <div className="min-h-screen bg-zinc-950 text-zinc-100">{children}</div>;
    }

    const handleLogout = async () => {
        await logout();
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Menu Items', href: '/admin/menu', icon: Utensils },
        { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg">
                        <Image src="/assets/filfora_ghar_small.png" alt="Logo" width={100} height={30} className="object-contain h-6 w-auto mix-blend-multiply" />
                    </div>
                    <span className="font-bold text-sm tracking-widest text-zinc-400 uppercase">Admin</span>
                </div>

                <div className="p-4 flex-grow">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <div className="px-4 mb-4">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Logged in as</p>
                        <p className="text-sm font-bold text-zinc-300 truncate">{adminEmail}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-semibold text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
