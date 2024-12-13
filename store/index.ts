import { AuthResponse, User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: null | string;
    user: User | null;
    login: (data: AuthResponse['metadata']) => void;
    logout: () => void;
    updateUser: (updatedFields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,

            login: (metadata) => set({ user: metadata.user, token: metadata.tokens.accessToken }),
            logout: () => set({ user: null }),
            updateUser: (updatedFields) => set(state => ({
                user: state.user ? { ...state.user, ...updatedFields } : null
            }))
        }),
        {
            name: 'auth-storage',
        }
    )
);
