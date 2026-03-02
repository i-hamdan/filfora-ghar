import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string; // Relates to menu_items.id
    name: string;
    price: number;
    image_url: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    checkoutDetails: { date: string | null; addressId: string | null };
    setCheckoutDetails: (details: { date: string; addressId: string }) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            checkoutDetails: { date: null, addressId: null },

            addItem: (itemObj, quantity = 1) => set((state) => {
                const existingItem = state.items.find(item => item.id === itemObj.id);
                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.id === itemObj.id ? { ...item, quantity: item.quantity + quantity } : item
                        )
                    };
                }
                return { items: [...state.items, { ...itemObj, quantity }] };
            }),

            removeItem: (id) => set((state) => ({
                items: state.items.filter(item => item.id !== id)
            })),

            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map(item =>
                    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                )
            })),

            clearCart: () => set({ items: [], checkoutDetails: { date: null, addressId: null } }),

            setCheckoutDetails: (details) => set({ checkoutDetails: details }),
        }),
        {
            name: "filfora-cart",
        }
    )
);
