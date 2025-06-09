import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { AuthContextType } from '@/src/types/auth';
import { Session } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

// This hook will protect the route access based on user authentication.
function useProtectedRoute(session: Session | null) {
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Wait for initial mount
  useEffect(() => {
    setIsNavigationReady(true);
  }, []);

  // Handle navigation after mount
  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/login');
    } else if (session && inAuthGroup) {
      router.replace('/(protected)/(tabs)/home');
    }
  }, [session, segments, isNavigationReady, router]);
}

// This hook can be used to access the user info.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, setSession, isLoading, setIsLoading } = useUserStore();

  useProtectedRoute(session);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (event === 'SIGNED_OUT') {
          // Clear any persisted session data
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(session);
        }
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    // Clear local state first
    setSession(null);
    
    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return null; // Or return a loading spinner if you prefer
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
