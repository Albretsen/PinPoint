import { useAuth } from '@/src/context/AuthProvider';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the Protected Home Screen!</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
} 