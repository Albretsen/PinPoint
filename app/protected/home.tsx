import { supabase } from '@/src/lib/supabase';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Welcome to the Protected Home Screen!</Text>
      <Text>Welcome to the Protected Home Screen!</Text>
      <Text>Welcome to the Protected Home Screen!</Text>
      <Text>Welcome to the Protected Home Screen!</Text>
      <Text>Welcome to the Protected Home Screen!</Text>
      <Text>Welcome to the Protected Home Screen!</Text>
      <Text>Welcome to the Protected Home Screen!</Text>
      <Text>Welcome to the Protected Home Screen!</Text>
      <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}