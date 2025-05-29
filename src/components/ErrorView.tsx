import { useTheme } from '@/src/context/ThemeProvider';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from '../i18n/useTranslation';
import { ApiError } from '../utils/apiError';
import PinText from './PinText';
import { RetryButton } from './RetryButton';

interface ErrorViewProps {
  error: Error | ApiError;
  onRetry?: () => void;
}

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getErrorMessage = () => {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 404:
          return t('error.notFound');
        case 401:
          return t('error.unauthorized');
        case 403:
          return t('error.forbidden');
        case 500:
          return t('error.serverError');
        default:
          return error.message || t('error.unknownError');
      }
    }
    return error.message || t('error.unknownError');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        {t('error.somethingWentWrong')}
      </PinText>
      <PinText style={[styles.message, { color: theme.colors.text }]}>
        {getErrorMessage()}
      </PinText>
      {onRetry && <RetryButton onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 