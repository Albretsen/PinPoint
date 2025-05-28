import { useTheme } from '@/src/context/ThemeProvider';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';
import PinText from './PinText';

interface CardProps {
  image: ImageSourcePropType;
  header: string;
  subheading: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ image, header, subheading, buttonLabel, onButtonPress }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { borderColor: theme.colors.frameBorder, backgroundColor: theme.colors.card }]}> 
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        {buttonLabel && onButtonPress && (
          <TouchableOpacity
            style={[
              styles.buttonOverlay,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.text,
              },
            ]}
            onPress={onButtonPress}
          >
            <PinText style={[styles.buttonText, { color: theme.colors.text }]}>{buttonLabel}</PinText>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <PinText style={[styles.header, { color: theme.colors.text }]}>{header}</PinText>
        <PinText style={[styles.subheading, { color: theme.colors.text }]}>{subheading}</PinText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
    margin: 8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonOverlay: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 2,
    zIndex: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 12,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Card; 