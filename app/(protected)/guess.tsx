import { FullScreenView } from '@/src/components/FullScreenView';
import { IconButton } from '@/src/components/IconButton';
import { useTheme } from '@/src/context/ThemeProvider';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export default function GuessScreen() {
  const { theme } = useTheme();
  const { imageUrl } = useLocalSearchParams<{ imageUrl: string }>();
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.splitView}>
        <TouchableWithoutFeedback onPress={() => setIsImageFullScreen(true)}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.iconContainer}>
              <IconButton
                name="expand"
                onPress={() => setIsImageFullScreen(true)}
                color={theme.colors.background}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => setIsMapFullScreen(true)}>
          <View style={[styles.mapContainer, { backgroundColor: '#4CAF50' }]}>
            <View style={styles.iconContainer}>
              <IconButton
                name="expand"
                onPress={() => setIsMapFullScreen(true)}
                color={theme.colors.background}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {isImageFullScreen && (
        <FullScreenView 
          onClose={() => setIsImageFullScreen(false)}
          closeButton={
            <View style={styles.fullScreenIconContainer}>
              <IconButton
                name="contract"
                onPress={() => setIsImageFullScreen(false)}
                color={theme.colors.background}
              />
            </View>
          }
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.fullScreenImage}
            contentFit="contain"
          />
        </FullScreenView>
      )}

      {isMapFullScreen && (
        <FullScreenView 
          onClose={() => setIsMapFullScreen(false)}
          closeButton={
            <View style={styles.fullScreenIconContainer}>
              <IconButton
                name="contract"
                onPress={() => setIsMapFullScreen(false)}
                color={theme.colors.background}
              />
            </View>
          }
        >
          <View style={[styles.fullScreenMap, { backgroundColor: '#4CAF50' }]} />
        </FullScreenView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splitView: {
    flex: 1,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenMap: {
    width: '100%',
    height: '100%',
  },
  fullScreenIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
  },
}); 