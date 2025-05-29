import { useTheme } from '@/src/context/ThemeProvider';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function GuessScreen() {
  const { theme } = useTheme();
  const { imageUrl } = useLocalSearchParams<{ imageUrl: string }>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.splitView}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
        <View style={[styles.mapContainer, { backgroundColor: theme.colors.card }]}>
          {/* Map will be added here later */}
        </View>
      </View>
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
}); 