"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-9 h-9" />;

    return (
        <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative text-zinc-900 dark:text-zinc-100"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 drop-shadow-sm rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2 left-2 h-5 w-5 drop-shadow-sm rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    );
}
