import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PreviewScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useUserStore();
  const params = useLocalSearchParams<{
    name: string;
    description: string;
    isPublic: string;
    inviteCode: string;
    challengeTime: string;
  }>();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!session?.user?.id) return;
    
    setIsCreating(true);
    try {
      const { data: group, error } = await supabase
        .from('groups')
        .insert({
          name: params.name,
          description: params.description,
          is_public: params.isPublic === 'true',
          invite_code: params.isPublic === 'false' ? params.inviteCode : null,
          owner_id: session.user.id,
          daily_challenge_time: new Date(params.challengeTime).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          }),
        })
        .select()
        .single();

      if (error) throw error;

      // Add the creator as an admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: session.user.id,
          is_admin: true,
        });

      if (memberError) throw memberError;

      router.push({
        pathname: '/(protected)/create-group/success',
        params: { groupId: group.id },
      });
    } catch (error) {
      console.error('Error creating group:', error);
      // TODO: Show error toast
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        {t('groups.create.preview.title')}
      </PinText>

      <View style={[styles.previewCard, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.border }]}>
          <Ionicons name="image-outline" size={40} color={theme.colors.text} />
        </View>

        <View style={styles.previewContent}>
          <View style={styles.headerRow}>
            <PinText style={[styles.groupName, { color: theme.colors.text }]}>
              {params.name}
            </PinText>
            <View style={[styles.badge, { backgroundColor: params.isPublic === 'true' ? theme.colors.primary : theme.colors.border }]}>
              <PinText style={[styles.badgeText, { color: theme.colors.background }]}>
                {params.isPublic === 'true' ? t('groups.public') : t('groups.private')}
              </PinText>
            </View>
          </View>

          <PinText style={[styles.description, { color: theme.colors.text }]}>
            {params.description}
          </PinText>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={theme.colors.text} />
              <PinText style={[styles.infoText, { color: theme.colors.text }]}>
                {new Date(params.challengeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </PinText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateGroup}
          disabled={isCreating}
        >
          <PinText style={[styles.buttonText, { color: theme.colors.background }]}>
            {t('groups.create.preview.confirm')}
          </PinText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.border }]}
          onPress={() => router.back()}
          disabled={isCreating}
        >
          <PinText style={[styles.buttonText, { color: theme.colors.text }]}>
            {t('groups.create.preview.cancel')}
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
  previewCard: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 30,
  },
  coverPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 'auto',
    gap: 12,
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