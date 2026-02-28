"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Placeholder to avoid layout shift before hydration
    if (!mounted) return <div className="w-[100px] h-8" />;

    const isDark = resolvedTheme === 'dark';

    return (
        <div className="flex items-center gap-2 sm:gap-3">
            <span
                className={cn(
                    "text-xs font-semibold tracking-wide transition-opacity duration-300 hidden sm:block",
                    isDark ? "opacity-30 dark:opacity-40" : "opacity-100 text-zinc-900"
                )}
            >
                Light
            </span>

            <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={cn(
                    "relative w-16 h-8 rounded-full transition-colors duration-500 ease-in-out p-1 flex items-center flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50",
                    isDark ? "bg-slate-800" : "bg-[#fde6b3]" // matched to image light/dark tracks
                )}
                aria-label="Toggle theme"
                type="button"
            >
                <motion.div
                    className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shadow-md",
                        isDark ? "bg-[#2596be] text-white" : "bg-[#f5b839] text-white"
                    )}
                    initial={false}
                    animate={{
                        x: isDark ? 32 : 0, // Track width (64) - padding (8) - thumb width (24) = 32
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                    }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isDark ? (
                            <motion.div
                                key="moon"
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Moon className="w-3.5 h-3.5 fill-current" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sun"
                                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sun className="w-4 h-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </button>

            <span
                className={cn(
                    "text-xs font-semibold tracking-wide transition-opacity duration-300 hidden sm:block",
                    isDark ? "opacity-100 text-white" : "opacity-40"
                )}
            >
                Dark
            </span>
        </div>
    );
}
