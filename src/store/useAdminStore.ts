import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AdminState {
    isAdminAuthenticated: boolean;
    adminEmail: string | null;
    isLoading: boolean;
    checkSession: () => Promise<void>;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
    isAdminAuthenticated: false,
    adminEmail: null,
    isLoading: true,

    checkSession: async () => {
        set({ isLoading: true });
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session?.user && session.user.email) {
            // Optional: You could also query the `profiles` table here to 
            // explicitly check `is_admin = true` if you want tighter security.
            set({
                isAdminAuthenticated: true,
                adminEmail: session.user.email,
                isLoading: false
            });
        } else {
            set({ isAdminAuthenticated: false, adminEmail: null, isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            set({ isLoading: false });
            return { error: error.message };
        }

        set({
            isAdminAuthenticated: true,
            adminEmail: data.user?.email || null,
            isLoading: false
        });

        return { error: null };
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ isAdminAuthenticated: false, adminEmail: null });
    }
}));
