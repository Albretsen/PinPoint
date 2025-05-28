import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useUserStore } from '@/src/store/userStore';
import { Button, Image, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { session, signOut } = useUserStore();
  const userData = session?.user?.user_metadata;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userData?.avatar_url }}
          style={styles.avatar}
        />
        <PinText style={[styles.username, { color: theme.colors.text }]}>
          {userData?.username || 'Anonymous'}
        </PinText>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
}); 