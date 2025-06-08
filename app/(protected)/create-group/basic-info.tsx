import PinText from '@/src/components/PinText';
import { PinTextInput } from '@/src/components/PinTextInput';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function BasicInfoScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/(protected)/create-group/privacy',
      params: {
        name,
        description,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        {t('groups.create.basicInfo.title')}
      </PinText>

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
        onPress={() => {
          // TODO: Implement image picker
        }}
      >
        <Ionicons name="image-outline" size={24} color={theme.colors.text} />
        <PinText style={[styles.coverPhotoText, { color: theme.colors.text }]}>
          {t('groups.create.basicInfo.selectCoverPhoto')}
        </PinText>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleNext}
          disabled={!name.trim()}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
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