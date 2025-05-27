import { useAuth } from '@/src/context/AuthProvider';
import Auth from '@/src/screens/Auth';
import { Redirect } from 'expo-router';

export default function LoginScreen() {
    const { session } = useAuth();
    
    if (session) {
        return <Redirect href="/home" />;
      }

  return <Auth />;
}