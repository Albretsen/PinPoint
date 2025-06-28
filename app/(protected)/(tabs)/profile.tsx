import ProfileTop from '@/src/components/profile/ProfileTop';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { useUserStore } from '@/src/store/userStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { session, signOut } = useUserStore();
  const userData = session?.user?.user_metadata;
  const [showModal, setShowModal] = useState(false);
  const isAnonymous = session?.user?.is_anonymous;
  const router = useRouter();
  const { t } = useTranslation();

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
      <ProfileTop
        name={userData?.username || t('profile.anonymous')}
        profileImage={{ uri: userData?.avatar_url }}
        backgroundImage={{ uri: userData?.background_url }}
        leftStat={{
          value: '54,402',
          label: 'Total points'
        }}
        rightStat={{
          value: '7',
          label: 'Friends'
        }}
        level={300}
      />
      <View style={styles.buttonContainer}>
        <Button title={t('auth.signOut')} onPress={handleSignOutPress} />
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
              {t('profile.signOutWarning')}
            </Text>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              {t('profile.anonymousSignOutWarning')}
            </Text>
            <View style={styles.modalButtons}>
              <Button title={t('profile.cancel')} onPress={handleCancel} />
              <Button title={t('profile.linkAccount')} onPress={handleLinkAccount} />
              <Button title={t('profile.continueSignOut')} onPress={handleContinueSignOut} />
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
    // padding: 20,
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