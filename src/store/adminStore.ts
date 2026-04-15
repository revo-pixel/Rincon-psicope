import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  password: string;
  login: (inputPassword: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      password: 'psicope1096',
      login: (inputPassword: string) => {
        if (inputPassword === get().password) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      changePassword: (newPassword: string) => set({ password: newPassword }),
    }),
    {
      name: 'admin-storage',
    }
  )
);
