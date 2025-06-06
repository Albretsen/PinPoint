import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handleImage = async (uri: string) => {
    // Navigate to the preview screen with the image URI
    router.push({
      pathname: '/image-preview',
      params: { imageUri: uri }
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        handleImage(photo.uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View style={[styles.container, { backgroundColor: theme.colors.background }]} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <PinText style={[styles.title, { color: theme.colors.text }]}>
          We need your permission to show the camera
        </PinText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={requestPermission}
        >
          <PinText style={styles.buttonText}>Grant Permission</PinText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing="back"
        animateShutter={true}
        mode="picture"
      />
      <View style={styles.overlay}>
        <TouchableOpacity
          style={[styles.galleryButton, { backgroundColor: theme.colors.primary }]}
          onPress={pickImage}
        >
          <Ionicons name="images" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.captureContainer}>
        <TouchableOpacity
          style={[styles.captureButton, { backgroundColor: theme.colors.primary }]}
          onPress={takePicture}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  galleryButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
}); 