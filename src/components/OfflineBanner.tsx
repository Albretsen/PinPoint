import { useTheme } from '@/src/context/ThemeProvider';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTranslation } from '../i18n/useTranslation';
import PinText from './PinText';

export function OfflineBanner() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isOnline ? -50 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [isOnline, slideAnim]);

  if (isOnline) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.error,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <PinText style={[styles.text, { color: theme.colors.background }]}>
        {t('error.networkError')}
      </PinText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 