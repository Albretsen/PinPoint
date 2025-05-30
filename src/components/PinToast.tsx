import { useTheme } from '@/src/context/ThemeProvider';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PinText from './PinText';

interface ToastContextType {
  showToast: (message: string) => void;
}

const PinToastContext = createContext<ToastContextType | undefined>(undefined);

export function usePinToast() {
  const ctx = useContext(PinToastContext);
  if (!ctx) throw new Error('usePinToast must be used within a PinToastProvider');
  return ctx;
}

export const PinToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slide = useSharedValue(-80);

  // Show toast, replace text if already visible
  const showToast = useCallback((message: string) => {
    setToast(message);
    if (!visible) {
      setVisible(true);
      slide.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        slide.value = withTiming(-80, { duration: 350, easing: Easing.in(Easing.cubic) });
        setTimeout(() => setVisible(false), 350);
      }, 2500);
    } else {
      // If already visible, just replace text and reset timer
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        slide.value = withTiming(-80, { duration: 350, easing: Easing.in(Easing.cubic) });
        setTimeout(() => setVisible(false), 350);
      }, 2500);
    }
  }, [slide, visible]);

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    slide.value = withTiming(-80, { duration: 350, easing: Easing.in(Easing.cubic) });
    setTimeout(() => setVisible(false), 350);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slide.value }],
  }));

  return (
    <PinToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <Animated.View style={[styles.toast, animatedStyle, { backgroundColor: theme.colors.text, top: 0, marginTop: insets.top + 12 }]}> 
            <PinText style={[styles.toastText, { color: theme.colors.background }]}>{toast}</PinText>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </PinToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    zIndex: 9999,
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    minWidth: Dimensions.get('window').width * 0.7,
    maxWidth: Dimensions.get('window').width * 0.95,
  },
  toastText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 