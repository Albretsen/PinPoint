import PinText from '@/src/components/PinText';
import { usePinToast } from '@/src/components/PinToast';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group } from '@/src/types/group';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import {
  FlipType,
  SaveFormat,
  useImageManipulator,
} from 'expo-image-manipulator';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

/* ───────────────── helper ───────────────── */
async function fetchGroups(userId: string): Promise<Group[]> {
  const { data, error } = await supabase
    .from('group_members')
    .select(
      `
    is_admin,
    joined_at,
    groups (
      id,
      name,
      is_public,
      cover_image
    )
  `
    )
    .eq('user_id', userId);

  if (error) throw error;

  return (data as any[])
    .filter((m) => m.groups)
    .map((m) => ({ ...m.groups, is_admin: m.is_admin, joined_at: m.joined_at }));
}

/* ───────────────── component ───────────────── */
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

  const {
    data: groups = [],
    isLoading: groupsLoading,
  } = useQuery({
    queryKey: ['myGroups', session?.user?.id],
    queryFn: () => fetchGroups(session!.user!.id),
    enabled: !!session?.user?.id,
  });

  /* keep local preview in sync */
  useEffect(() => {
    if (imageUri && !currentImageUri) setCurrentImageUri(imageUri);
  }, [imageUri, currentImageUri]);

  /* toggle helpers */
  const toggleGroup = (id: string) =>
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAllGroups = () =>
    setSelectedGroups(
      selectedGroups.size === groups.length
        ? new Set()
        : new Set(groups.map((g) => g.id))
    );

  /* simple rotate / flip helpers (local preview only) */
  const quickEdit = async (action: () => void) => {
    setIsLoading(true);
    try {
      action();
      const out = await manipulator.renderAsync();
      const saved = await out.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.9,
      });
      setCurrentImageUri(saved.uri);
    } finally {
      setIsLoading(false);
    }
  };

  /* UPLOAD via Edge Function */
  const handleUpload = async () => {
    if (!currentImageUri || selectedGroups.size === 0 || !session) return;
    setIsLoading(true);
    try {
      /* optional client resize (keeps data low) */
      manipulator.resize({ width: 1920 });
      const out = await manipulator.renderAsync();
      const saved = await out.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.9,
      });

      /* read file → base64 (no data URI prefix) */
      const base64 = await FileSystem.readAsStringAsync(saved.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      /* call Edge Function */
      const { error } = await supabase.functions.invoke('upload-image', {
        body: JSON.stringify({
          base64,
          group_ids: Array.from(selectedGroups),
          uploader_id: session.user.id,
          taken_at: new Date().toISOString(),
        }),
      });

      if (error) {
        console.error(error);
        showToast(t('imageUpload.error'));
        return;
      }

      showToast(t('navigation.upload.success'));
      router.back();
    } catch (err) {
      console.error(err);
      showToast(t('imageUpload.error'));
    } finally {
      setIsLoading(false);
    }
  };

  /* loading state while fetching groups */
  if (groupsLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  /* ──────────── UI ──────────── */
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: t('navigation.previewAndShare'),
          headerTintColor: theme.colors.text,
          headerStyle: { backgroundColor: theme.colors.background },
          headerBackTitle: t('navigation.back'),
        }}
      />

      {/* image preview */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          {currentImageUri ? (
            <Image source={{ uri: currentImageUri }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: theme.colors.card }]}>
              <PinText style={{ color: theme.colors.secondary }}>
                {t('navigation.noImageSelected')}
              </PinText>
            </View>
          )}
        </View>

        {/* edit buttons */}
        <View style={styles.editControls}>
          <EditBtn icon="arrow-undo" onPress={() => quickEdit(() => manipulator.rotate(-90))} />
          <EditBtn icon="arrow-redo" onPress={() => quickEdit(() => manipulator.rotate(90))} />
          <EditBtn icon="swap-horizontal" onPress={() => quickEdit(() => manipulator.flip(FlipType.Horizontal))} />
          <EditBtn icon="swap-vertical" onPress={() => quickEdit(() => manipulator.flip(FlipType.Vertical))} />
          <EditBtn icon="refresh" onPress={() => quickEdit(() => manipulator.reset())} />
        </View>

        {/* group picker */}
        <View style={styles.groupsContainer}>
          <View style={styles.groupsHeader}>
            <PinText style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold' }}>
              {t('navigation.shareWithGroups')}
            </PinText>
            <TouchableOpacity onPress={toggleAllGroups} style={[styles.selectAllButton, { backgroundColor: theme.colors.primary }]}>
              <PinText style={styles.selectAllText}>
                {selectedGroups.size === groups.length ? t('navigation.deselectAll') : t('navigation.selectAll')}
              </PinText>
            </TouchableOpacity>
          </View>

          {groups.map((g) => (
            <TouchableOpacity
              key={g.id}
              onPress={() => toggleGroup(g.id)}
              style={[styles.groupItem, { backgroundColor: theme.colors.card }]}
            >
              <View style={styles.groupInfo}>
                <PinText style={{ color: theme.colors.text, fontSize: 16 }}>{g.name}</PinText>
                <PinText style={{ color: theme.colors.secondary, fontSize: 14 }}>
                  {g.is_public ? t('groups.public') : t('groups.private')}
                </PinText>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGroups.has(g.id) && { backgroundColor: theme.colors.primary },
                ]}
              >
                {selectedGroups.has(g.id) && <Ionicons name="checkmark" size={20} color="white" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* main CTA */}
      <TouchableOpacity
        disabled={selectedGroups.size === 0 || isLoading}
        style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleUpload}
      >
        <PinText style={styles.shareButtonText}>
          {t('navigation.shareWithX', { count: selectedGroups.size })}
        </PinText>
      </TouchableOpacity>
    </View>
  );
}

/* ───────── small EditButton component ───────── */
const EditBtn = ({ icon, onPress }: { icon: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.editButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color="white" />
  </TouchableOpacity>
);

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  editControls: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  editButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#666', justifyContent: 'center', alignItems: 'center' },
  groupsContainer: { padding: 16 },
  groupsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  selectAllButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  selectAllText: { color: 'white', fontSize: 14 },
  groupItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8 },
  groupInfo: { flex: 1 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  shareButton: { margin: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  shareButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
