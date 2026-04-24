import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';
import { useAuthStore } from './authStore';
import { toast } from 'sonner';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'PayPal',

      // Calculate totals
      getTotals: () => {
        const { cartItems } = get();
        const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = 0.15 * itemsPrice;
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        return {
          itemsPrice: itemsPrice.toFixed(2),
          shippingPrice: shippingPrice.toFixed(2),
          taxPrice: taxPrice.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        };
      },

      addToCart: async (product, qty) => {
        const { cartItems } = get();
        const existItem = cartItems.find((x) => x.product === product._id);

        let newCartItems;
        if (existItem) {
          newCartItems = cartItems.map((x) =>
            x.product === existItem.product ? { ...product, product: product._id, qty } : x
          );
        } else {
          newCartItems = [...cartItems, { ...product, product: product._id, qty }];
        }

        set({ cartItems: newCartItems });
        toast.success('Added to cart');

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          try {
            await api.post('/cart/items', { cartItems: newCartItems });
          } catch (error) {
            console.error('Failed to sync cart to backend', error);
          }
        }
      },

      removeFromCart: async (id) => {
        const newCartItems = get().cartItems.filter((x) => x.product !== id);
        set({ cartItems: newCartItems });

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          try {
            await api.post('/cart/items', { cartItems: newCartItems });
          } catch (error) {
            console.error('Failed to sync cart to backend', error);
          }
        }
      },

      saveShippingAddress: (data) => {
        set({ shippingAddress: data });
      },

      savePaymentMethod: (data) => {
        set({ paymentMethod: data });
      },

      clearCartItems: () => {
        set({ cartItems: [] });
      },

      syncCartWithBackend: async () => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
           try {
             // 1. Get backend cart
             const res = await api.get('/cart');
             const backendCartItems = res.data.data.cart?.cartItems || [];
             
             // 2. Merge local and backend (simplified: favor local if merging after login, else favor backend)
             // For now, let's just push local to backend
             const { cartItems } = get();
             if (cartItems.length > 0) {
               const syncRes = await api.post('/cart/items', { cartItems });
               set({ cartItems: syncRes.data.data.cart.cartItems });
             } else if (backendCartItems.length > 0) {
               set({ cartItems: backendCartItems });
             }
           } catch (error) {
             console.error('Failed to load cart from backend', error);
           }
        }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
