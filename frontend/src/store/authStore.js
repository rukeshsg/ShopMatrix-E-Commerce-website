import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';
import { toast } from 'sonner';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          set({
            user: res.data.data.user,
            accessToken: res.data.data.accessToken,
            isAuthenticated: true,
            isLoading: false
          });
          toast.success('Logged in successfully');
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Login failed');
          return false;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', { name, email, password });
          set({
            user: res.data.data.user,
            accessToken: res.data.data.accessToken,
            isAuthenticated: true,
            isLoading: false
          });
          toast.success('Registered successfully');
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Registration failed');
          return false;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout failed', error);
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
          toast.info('Logged out');
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },
    }),
    {
      name: 'auth-storage',
      // only persist user and isAuthenticated, accessToken can also be persisted or rely on refresh
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, accessToken: state.accessToken }),
    }
  )
);
