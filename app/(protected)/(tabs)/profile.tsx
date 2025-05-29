import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useUserStore } from '@/src/store/userStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { session, signOut } = useUserStore();
  const userData = session?.user?.user_metadata;
  const [showModal, setShowModal] = useState(false);
  const isAnonymous = session?.user?.is_anonymous;
  const router = useRouter();

  const handleSignOutPress = () => {
    if (isAnonymous) {
      setShowModal(true);
    } else {
      signOut();
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleContinueSignOut = () => {
    setShowModal(false);
    signOut();
  };

  const handleLinkAccount = () => {
    setShowModal(false);
    router.push('/link-account');
  };

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
        <Button title="Sign Out" onPress={handleSignOutPress} />
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Sign Out Warning
            </Text>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              You are signed in as an anonymous user. If you sign out, you will lose access to this account and all associated data.
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={handleCancel} />
              <Button title="Link Account" onPress={handleLinkAccount} />
              <Button title="Continue Sign Out" onPress={handleContinueSignOut} />
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    width: '100%',
    gap: 10,
  },
}); 