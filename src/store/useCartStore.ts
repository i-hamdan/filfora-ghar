import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string; // Relates to menu_items.id
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (id: string, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],

            addItem: (id, quantity = 1) => set((state) => {
                const existingItem = state.items.find(item => item.id === id);
                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.id === id ? { ...item, quantity: item.quantity + quantity } : item
                        )
                    };
                }
                return { items: [...state.items, { id, quantity }] };
            }),

            removeItem: (id) => set((state) => ({
                items: state.items.filter(item => item.id !== id)
            })),

            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map(item =>
                    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                )
            })),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: "filfora-cart",
        }
    )
);
