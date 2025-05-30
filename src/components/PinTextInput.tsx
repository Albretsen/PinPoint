import { useTheme } from '@/src/context/ThemeProvider';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import PinText from './PinText';

interface PinTextInputProps extends TextInputProps {
  label: string;
}

export function PinTextInput({ label, style, ...props }: PinTextInputProps) {
  const { theme } = useTheme();

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
            borderColor: theme.colors.inputBorder,
            fontFamily: 'Satoshi',
          },
          style,
        ]}
        placeholderTextColor={theme.colors.text + '80'}
        {...props}
      />
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
}); 