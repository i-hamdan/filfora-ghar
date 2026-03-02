"use client";

import { useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: ReactNode }) {
    const { setUser } = useAuthStore();

    useEffect(() => {
        // 1. Initial Session Check
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUser(profile as any);
                }
            } else {
                setUser(null);
            }
        };

        initAuth();

        // 2. Listen for State Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUser(profile as any);
                }
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser]);

    return <>{children}</>;
}
