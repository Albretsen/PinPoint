import PinText from '@/src/components/PinText';
import { usePinToast } from '@/src/components/PinToast';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group } from '@/src/types/group';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import { FlipType, SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

async function fetchGroups(userId: string): Promise<Group[]> {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      is_admin,
      joined_at,
      groups (
        id,
        name,
        is_public,
        invite_code,
        owner_id,
        created_at,
        daily_challenge_time,
        is_archived,
        description,
        cover_image
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;

  return (data as any[])
    .filter(member => member.groups)
    .map(member => ({
      ...member.groups,
      is_admin: member.is_admin,
      joined_at: member.joined_at,
    }));
}

export default function ImagePreviewScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showToast } = usePinToast();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { session } = useUserStore();
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string | null>(null);
  
  const manipulator = useImageManipulator(imageUri);

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['myGroups', session?.user?.id],
    queryFn: () => fetchGroups(session!.user!.id),
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (imageUri && !currentImageUri) {
      setCurrentImageUri(imageUri);
    }
  }, [imageUri, currentImageUri]);

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const toggleAllGroups = () => {
    if (selectedGroups.size === groups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(groups.map(g => g.id)));
    }
  };

  const handleRotate = async (degrees: number) => {
    setIsLoading(true);
    try {
      manipulator.rotate(degrees);
      const result = await manipulator.renderAsync();
      const saved = await result.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.8,
      });
      setCurrentImageUri(saved.uri);
    } catch (error) {
      console.error('Error rotating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = async (flipType: FlipType) => {
    setIsLoading(true);
    try {
      manipulator.flip(flipType);
      const result = await manipulator.renderAsync();
      const saved = await result.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.8,
      });
      setCurrentImageUri(saved.uri);
    } catch (error) {
      console.error('Error flipping image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      manipulator.reset();
      const result = await manipulator.renderAsync();
      const saved = await result.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.8,
      });
      setCurrentImageUri(saved.uri);
    } catch (error) {
      console.error('Error resetting image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!currentImageUri || selectedGroups.size === 0 || !session?.user?.id) return;

    try {
      setIsLoading(true);

      // 1. Convert image to JPEG and get base64
      manipulator.resize({
        width: 1920,
      });
      const result = await manipulator.renderAsync();
      const saved = await result.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.6, // Increased compression (lower quality)
      });

      // 2. Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(saved.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 3. Generate a unique filename
      const filename = `${session.user.id}/${Date.now()}.jpg`;

      // 4. Upload to Supabase storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('photos')
        .upload(`user_uploads/${filename}`, Buffer.from(base64, 'base64'), {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        showToast(t('imageUpload.storageError'));
        return;
      }

      // 5. Create entries in group_images table
      const { error: dbError } = await supabase.from('group_images').insert(
        Array.from(selectedGroups).map((groupId: string) => ({
          group_id: groupId,
          image_url: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/user_uploads/${filename}`,
          storage_path: `photos/user_uploads/${filename}`,
          uploader_id: session.user.id,
        }))
      );

      if (dbError) {
        console.error('Database error:', dbError);
        showToast(t('imageUpload.databaseError'));
        return;
      }

      // Show success message
      showToast(t('navigation.upload.success'));

      // 6. Navigate back to the camera screen
      router.back();
    } catch (error) {
      console.error('Error uploading image:', error);
      // Generic error message if not handled above
      if (!(error instanceof Error) || !error.message.includes('violates row-level security policy')) {
        showToast(t('navigation.upload.error.unknown'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingGroups) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: t('navigation.previewAndShare') || 'Preview & Share',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerBackTitle: t('navigation.back'),
        }} 
      />
      <ScrollView style={[styles.scrollView, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.background }]}>
          {currentImageUri ? (
            <Image
              source={{ uri: currentImageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: theme.colors.card }]}>
              <PinText style={[styles.placeholderText, { color: theme.colors.secondary }]}>
                {t('navigation.noImageSelected') || 'No image selected'}
              </PinText>
            </View>
          )}
        </View>

        <View style={[styles.editControls, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleRotate(-90)}
            disabled={isLoading}
          >
            <Ionicons name="arrow-undo" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleRotate(90)}
            disabled={isLoading}
          >
            <Ionicons name="arrow-redo" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleFlip(FlipType.Horizontal)}
            disabled={isLoading}
          >
            <Ionicons name="swap-horizontal" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleFlip(FlipType.Vertical)}
            disabled={isLoading}
          >
            <Ionicons name="swap-vertical" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleReset}
            disabled={isLoading}
          >
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.groupsContainer}>
          <View style={styles.groupsHeader}>
            <PinText style={[styles.groupsTitle, { color: theme.colors.text }]}>
              Share with Groups
            </PinText>
            <TouchableOpacity
              onPress={toggleAllGroups}
              style={[styles.selectAllButton, { backgroundColor: theme.colors.primary }]}
            >
              <PinText style={styles.selectAllText}>
                {selectedGroups.size === groups.length ? 'Deselect All' : 'Select All'}
              </PinText>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[styles.groupItem, { backgroundColor: theme.colors.card }]}
                onPress={() => toggleGroup(group.id)}
              >
                <View style={styles.groupInfo}>
                  <PinText style={[styles.groupName, { color: theme.colors.text }]}>
                    {group.name}
                  </PinText>
                  <PinText style={[styles.groupType, { color: theme.colors.secondary }]}>
                    {group.is_public ? 'Public' : 'Private'}
                  </PinText>
                </View>
                <View style={[styles.checkbox, selectedGroups.has(group.id) && { backgroundColor: theme.colors.primary }]}>
                  {selectedGroups.has(group.id) && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleUpload}
        disabled={selectedGroups.size === 0 || isLoading}
      >
        <PinText style={styles.shareButtonText}>
          Share with {selectedGroups.size} {selectedGroups.size === 1 ? 'Group' : 'Groups'}
        </PinText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
  },
  editControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#000',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupsContainer: {
    padding: 16,
  },
  groupsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectAllText: {
    color: 'white',
    fontSize: 14,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
  },
  groupType: {
    fontSize: 14,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 