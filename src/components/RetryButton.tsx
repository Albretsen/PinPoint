import { useTheme } from '@/src/context/ThemeProvider';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from '../i18n/useTranslation';
import PinText from './PinText';

interface RetryButtonProps {
  onPress: () => void;
  message?: string;
}

export function RetryButton({ onPress, message }: RetryButtonProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.primary,
        },
      ]}
      onPress={onPress}
    >
      <PinText style={[styles.text, { color: theme.colors.background }]}>
        {message || t('error.tryAgain')}
      </PinText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 