import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import PinText from './PinText';

interface PinTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export function PinTextInput({ 
  label, 
  style, 
  error, 
  maxLength,
  showCharacterCount,
  value,
  ...props 
}: PinTextInputProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const characterCount = typeof value === 'string' ? value.length : 0;
  const remainingChars = maxLength ? maxLength - characterCount : 0;

  return (
    <View style={styles.container}>
      <PinText style={[styles.label, { color: theme.colors.text }]}>
        {label}
      </PinText>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            borderColor: error ? theme.colors.error : theme.colors.inputBorder,
            fontFamily: 'Satoshi',
          },
          style,
        ]}
        placeholderTextColor={theme.colors.text + '80'}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      <View style={styles.footer}>
        {error && (
          <PinText style={[styles.error, { color: theme.colors.error }]}>{error}</PinText>
        )}
        {showCharacterCount && maxLength && (
          <PinText style={[styles.characterCount, { color: theme.colors.text }]}>
            {t('groups.create.basicInfo.charactersLeft', { count: remainingChars })}
          </PinText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 2,
    paddingHorizontal: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  error: {
    fontSize: 13,
    flex: 1,
  },
  characterCount: {
    fontSize: 13,
    opacity: 0.7,
  },
}); 