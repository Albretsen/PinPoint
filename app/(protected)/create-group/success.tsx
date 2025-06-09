import { PinButton } from '@/src/components/PinButton';
import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function SuccessScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const handleViewGroup = () => {
    // Reset the entire navigation stack and navigate to the group screen
    router.replace('/(protected)/(tabs)/groups');
    router.push({
      pathname: '/(protected)/group/[id]',
      params: { id: groupId }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="checkmark" size={48} color={theme.colors.background} />
        </View>

        <PinText style={[styles.description, { color: theme.colors.text }]}>
          {t('groups.create.success.description')}
        </PinText>
      </View>

      <View style={styles.buttonContainer}>
        <PinButton
          variant="primary"
          onPress={handleViewGroup}
        >
          {t('groups.create.success.viewGroup')}
        </PinButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
}); 