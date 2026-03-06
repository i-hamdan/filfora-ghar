"use client";

import { useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

// Helper: race a promise against a timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Auth session check timed out")), ms)
        ),
    ]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const { setUser, setAuthReady } = useAuthStore();

    useEffect(() => {
        // 1. Initial Session Check (with timeout)
        const initAuth = async () => {
            try {
                const { data: { session } } = await withTimeout(
                    supabase.auth.getSession(),
                    5000
                );

                if (session?.user) {
                    const { data: profile } = await withTimeout(
                        Promise.resolve(supabase.from('profiles').select('*').eq('id', session.user.id).single()),
                        5000
                    ) as any;
                    if (profile) {
                        setUser(profile);
                    } else {
                        setUser(null);
                    }
                } else {
                    // Session is null/expired — clear Supabase internal auth state
                    await supabase.auth.signOut().catch(() => { });
                    setUser(null);
                }
            } catch (err) {
                console.warn("Auth init failed or timed out, clearing session:", err);
                // Force sign-out to unblock any queued Supabase requests
                await supabase.auth.signOut().catch(() => { });
                setUser(null);
            } finally {
                setAuthReady(true);
            }
        };

        initAuth();

        // 2. Listen for State Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
                return;
            }
            if (session?.user) {
                try {
                    const { data: profile } = await withTimeout(
                        Promise.resolve(supabase.from('profiles').select('*').eq('id', session.user.id).single()),
                        5000
                    ) as any;
                    if (profile) {
                        setUser(profile);
                    }
                } catch (err) {
                    console.warn("Profile fetch failed on auth change:", err);
                }
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser, setAuthReady]);

    return <>{children}</>;
}

