import { useAuth } from '@/src/context/AuthProvider';
import { useTheme } from '@/src/context/ThemeProvider';
import Auth from '@/src/screens/Auth';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const { session } = useAuth();
  const { theme } = useTheme();
  
  if (session) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Auth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 