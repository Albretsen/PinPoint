import { useSession } from '@/src/context/AuthProvider';
import { Redirect, Slot } from 'expo-router';

export default function ProtectedLayout() {
  const session = useSession();
  
  console.log("Session in ProtectedLayout:", session);

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
