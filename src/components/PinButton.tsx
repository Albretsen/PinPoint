import { useTheme } from '@/src/context/ThemeProvider';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import PinText from './PinText';

export type PinButtonVariant = 'primary' | 'secondary' | 'outline' | 'pill';

interface PinButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: PinButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PinButton({ 
  children,
  onPress,
  variant = 'primary', 
  loading = false,
  disabled = false,
  style 
}: PinButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.buttonFilledBackground,
          borderColor: theme.colors.buttonFilledBackground,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.text,
        };
      case 'pill':
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 4,
        };
      default:
        return {};
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'pill':
        return {
          color: theme.colors.buttonFilledText,
          fontSize: 14,
        };
      case 'outline':
        return {
          color: theme.colors.text,
        };
      default:
        return {};
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(),
        {
          opacity: pressed || disabled ? 0.7 : 1,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' ? theme.colors.text : theme.colors.buttonFilledText}
          />
        ) : (
          <PinText style={[styles.text, getTextStyle()]}>
            {children}
          </PinText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
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
  disabled: {
    opacity: 0.5,
  },
}); 