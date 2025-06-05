import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';
import PinText from './PinText';

interface CardProps {
  image?: ImageSourcePropType;
  header: string;
  subheading: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  image, 
  header, 
  subheading, 
  buttonLabel, 
  onButtonPress,
  onPress 
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity 
      style={[styles.card, { borderColor: theme.colors.frameBorder, backgroundColor: theme.colors.card }]}
      onPress={onPress}
    > 
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholderContainer, { backgroundColor: theme.colors.border }]}>
            <Ionicons name="image-outline" size={40} color={theme.colors.text} />
          </View>
        )}
        {buttonLabel && onButtonPress && (
          <TouchableOpacity
            style={[
              styles.buttonOverlay,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.text,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onButtonPress();
            }}
          >
            <PinText style={[styles.buttonText, { color: theme.colors.text }]}>
              {t('home.guessLocation')}
            </PinText>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <PinText style={[styles.header, { color: theme.colors.text }]}>{header}</PinText>
        <PinText style={[styles.subheading, { color: theme.colors.text }]}>{subheading}</PinText>
      </View>
    </TouchableOpacity>
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
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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