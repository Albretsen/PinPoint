import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function GroupScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('onboarding.joinOrCreateGroup')}
      </Text>
      
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {t('onboarding.groupDescription')}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title={t('auth.continue')}
          onPress={() => router.replace('/onboarding/intro')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  buttonContainer: {
    marginTop: 20,
  },
}); 