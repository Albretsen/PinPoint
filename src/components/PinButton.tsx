import { useTheme } from '@/src/context/ThemeProvider';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import PinText from './PinText';

export type PinButtonVariant = 'filled' | 'outlined';

interface PinButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: PinButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const PinButton: React.FC<PinButtonProps> = ({
  children,
  onPress,
  variant = 'filled',
  loading = false,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const isFilled = variant === 'filled';

  const backgroundColor = isFilled
    ? theme.colors.buttonFilledBackground
    : 'transparent';
  const textColor = isFilled
    ? theme.colors.buttonFilledText
    : theme.colors.text;
  const borderColor = isFilled
    ? theme.colors.buttonFilledBackground
    : theme.colors.text;
  const borderWidth = isFilled ? 0 : 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? '#ccc' : backgroundColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
          opacity: pressed || disabled ? 0.7 : 1,
        },
        isFilled ? styles.filled : styles.outlined,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        <PinText style={[styles.text, { color: textColor }]}> 
          {children}
        </PinText>
        {loading && (
          <ActivityIndicator
            size={18}
            color={textColor}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  filled: {
    // No extra styles needed
  },
  outlined: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 