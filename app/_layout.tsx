import { AuthProvider } from "@/src/context/AuthProvider";
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}