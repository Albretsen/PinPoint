import { useTheme } from '@/src/context/ThemeProvider';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface FrameProps {
  children: ReactNode;
  style?: ViewStyle;
}

const Frame: React.FC<FrameProps> = ({ children, style }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.frame,
        { borderColor: theme.colors.frameBorder },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    borderWidth: 2,
    borderRadius: 8,
  },
});

export default Frame; 