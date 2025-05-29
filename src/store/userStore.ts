import { supabase } from '@/src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { useDeviceStore } from './deviceStore';

type UserState = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Update device state after successful sign in
    const deviceStore = useDeviceStore.getState();
    deviceStore.setHasLoggedInBefore(true);
    deviceStore.setLastLoginDate(new Date().toISOString());
  },
  signUp: async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username, // Using DiceBear for placeholder avatars
        },
      },
    });
    if (error) throw error;
    
    // Update device state after successful sign up
    const deviceStore = useDeviceStore.getState();
    deviceStore.setHasLoggedInBefore(true);
    deviceStore.setLastLoginDate(new Date().toISOString());
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
})); 