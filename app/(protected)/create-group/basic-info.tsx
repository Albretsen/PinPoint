import PinText from '@/src/components/PinText';
import { PinTextInput } from '@/src/components/PinTextInput';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function BasicInfoScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setCoverImage(asset.uri);
  };

  const handleNext = () => {
    router.push({
      pathname: '/(protected)/create-group/privacy',
      params: {
        name,
        description,
        coverImage,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinTextInput
        label={t('groups.create.basicInfo.name')}
        placeholder={t('groups.create.basicInfo.namePlaceholder')}
        value={name}
        onChangeText={setName}
        maxLength={50}
        showCharacterCount
      />

      <PinTextInput
        label={t('groups.create.basicInfo.description')}
        placeholder={t('groups.create.basicInfo.descriptionPlaceholder')}
        value={description}
        onChangeText={setDescription}
        maxLength={140}
        showCharacterCount
        multiline
        numberOfLines={4}
        style={styles.descriptionInput}
      />

      <TouchableOpacity
        style={[styles.coverPhotoButton, { backgroundColor: theme.colors.card }]}
        onPress={handlePickImage}
        disabled={isUploading}
      >
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.coverImage} />
        ) : (
          <>
            <Ionicons name="image-outline" size={24} color={theme.colors.text} />
            <PinText style={[styles.coverPhotoText, { color: theme.colors.text }]}>
              {t('groups.create.basicInfo.selectCoverPhoto')}
            </PinText>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleNext}
          disabled={!name.trim() || isUploading}
        >
          <PinText style={[styles.buttonText, { color: theme.colors.background }]}>
            {t('navigation.next')}
          </PinText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  coverPhotoButton: {
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPhotoText: {
    marginTop: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 