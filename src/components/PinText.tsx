import React from 'react';
import { Text, TextProps } from 'react-native';

const PinText: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text style={[{ fontFamily: 'LilitaOne' }, style]} {...props} />;
};

export default PinText; 