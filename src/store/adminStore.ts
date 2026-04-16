import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AdminState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  checkSession: () => Promise<void>;
}

export const useAdminStore = create<AdminState>()((set) => ({
  isAuthenticated: false,
  isInitialized: false,
  
  login: async (inputPassword: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@psicope.com',
        password: inputPassword,
      });
      if (error) throw error;
      
      set({ isAuthenticated: true });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false });
  },

  changePassword: async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  checkSession: async () => {
    // Verificar sesión inicial
    const { data: { session } } = await supabase.auth.getSession();
    
    set({ 
      isAuthenticated: !!session,
      isInitialized: true 
    });

    // Suscribirse a los cambios de sesión (ej. si abre otra pestaña y se desloguea)
    supabase.auth.onAuthStateChange((_event, currentSession) => {
      set({ isAuthenticated: !!currentSession });
    });
  },
}));
