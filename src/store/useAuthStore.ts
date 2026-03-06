import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
    id: string;
    phone: string;
    full_name?: string;
}

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isAuthReady: boolean;
    setUser: (user: UserProfile | null) => void;
    setAuthReady: (ready: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isAuthReady: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setAuthReady: (ready) => set({ isAuthReady: ready }),
            logout: () => {
                supabase.auth.signOut();
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: "filfora-auth",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
