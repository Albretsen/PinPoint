import { AuthProvider } from "@/src/context/AuthProvider";
import { ThemeProvider } from "@/src/context/ThemeProvider";
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}