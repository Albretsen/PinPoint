import { supabase } from '@/src/lib/supabase';
import { UserState } from '@/src/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { useDeviceStore } from './deviceStore';

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
    try {
      // Clear all Supabase related storage first
      const keys = await AsyncStorage.getAllKeys();
      const supabaseKeys = keys.filter(key => 
        key.startsWith('supabase.auth') || 
        key.startsWith('sb-')
      );
      await AsyncStorage.multiRemove(supabaseKeys);

      // Clear local state
      set({ session: null });
      
      // Try to sign out from Supabase, but don't throw if it fails
      // since we've already cleared the storage
      await supabase.auth.signOut().catch(() => {
        // Ignore sign out errors since we've already cleared everything
      });
    } catch (error) {
      console.error('Error during sign out:', error);
      // Don't throw the error since we want to ensure the user is signed out
      // even if there are issues with the Supabase sign out
    }
  },
})); 