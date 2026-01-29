import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  price: number
  description: string
}

export interface CartItem extends Product {
  quantity: number
  observation?: string
}

interface CartState {
  cart: CartItem[]
  isCartOpen: boolean // Novo: controla se o modal está visível
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, action: 'increase' | 'decrease') => void
  total: () => number
  clearCart: () => void
  toggleCart: () => void // Novo: abre/fecha o modal
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false, // Começa fechado

      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.id === product.id)
        // Se já existe, aumenta a quantidade. Se não, adiciona e ABRE o carrinho pra dar feedback
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isCartOpen: true
          }
        }
        return { 
          cart: [...state.cart, { ...product, quantity: 1 }],
          isCartOpen: true 
        }
      }),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, action) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id === id) {
            const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1
            return { ...item, quantity: Math.max(0, newQuantity) }
          }
          return item
        }).filter((item) => item.quantity > 0),
      })),

      total: () => get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0),

      clearCart: () => set({ cart: [] }),
      
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: 'isa-sushi-cart',
    }
  )
)