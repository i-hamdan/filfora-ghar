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
    setUser: (user: UserProfile | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            logout: () => {
                supabase.auth.signOut();
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: "filfora-auth",
        }
    )
);
