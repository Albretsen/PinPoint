import { useSession } from '@/src/context/AuthProvider';
import Auth from '@/src/screens/Auth';
import { Redirect } from 'expo-router';

export default function LoginScreen() {
    const session = useSession();
    
    if (session) {
        return <Redirect href="/protected/home" />;
      }

  return <Auth />;
}