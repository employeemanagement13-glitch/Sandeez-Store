import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartStore {
    items: CartItem[]
    isCartOpen: boolean
    addItem: (item: CartItem) => void
    removeItem: (productId: string, size?: string, color?: string) => void
    updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
    openCart: () => void
    closeCart: () => void
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,

            addItem: (item) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (i) =>
                            i.product.id === item.product.id &&
                            i.size === item.size &&
                            i.color === item.color
                    )

                    if (existingIndex > -1) {
                        const newItems = [...state.items]
                        newItems[existingIndex].quantity += item.quantity
                        return { items: newItems }
                    }

                    return { items: [...state.items, item] }
                })
            },

            removeItem: (productId, size, color) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(
                                item.product.id === productId &&
                                item.size === size &&
                                item.color === color
                            )
                    ),
                }))
            },

            updateQuantity: (productId, quantity, size, color) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId &&
                            item.size === size &&
                            item.color === color
                            ? { ...item, quantity }
                            : item
                    ),
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                const items = get().items
                return items.reduce(
                    (total, item) => total + item.product.base_price * item.quantity,
                    0
                )
            },

            getItemCount: () => {
                const items = get().items
                return items.reduce((count, item) => count + item.quantity, 0)
            },

            openCart: () => set({ isCartOpen: true }),

            closeCart: () => set({ isCartOpen: false }),
        }),
        {
            name: 'cart-storage',
        }
    )
)
