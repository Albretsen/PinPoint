import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { Group } from '@/src/types/group';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

async function fetchGroupDetails(groupId: string): Promise<Group> {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      group_members (
        user_id
      )
    `)
    .eq('id', groupId)
    .single();

  if (error) throw error;

  // Count the number of members
  const { count, error: countError } = await supabase
    .from('group_members')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', groupId);

  if (countError) throw countError;

  return {
    ...data,
    member_count: count || 0,
  };
}

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group', id],
    queryFn: () => fetchGroupDetails(id),
    enabled: !!id,
  });

  const getMemberText = (count: number) => {
    return count === 1 ? t('groups.member') : t('groups.members');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: t('navigation.back'),
        }}
      />
      {isLoading ? (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <PinText>Loading...</PinText>
        </View>
      ) : error || !group ? (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <PinText>Error loading group details</PinText>
        </View>
      ) : (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          {/* Cover Image */}
          <View style={styles.coverContainer}>
            {group.cover_image ? (
              <Image
                source={{ uri: group.cover_image }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.border }]}>
                <Ionicons name="image-outline" size={40} color={theme.colors.text} />
              </View>
            )}
          </View>

          {/* Group Info */}
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <PinText style={[styles.title, { color: theme.colors.text }]}>
                {group.name}
              </PinText>
              <Ionicons
                name={group.is_public ? 'globe-outline' : 'lock-closed-outline'}
                size={24}
                color={group.is_public ? theme.colors.primary : theme.colors.text}
                style={styles.privacyIcon}
              />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={20} color={theme.colors.text} />
                <PinText style={[styles.statText, { color: theme.colors.text }]}>
                  {group.member_count} {getMemberText(group.member_count || 0)}
                </PinText>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    width: width,
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  privacyIcon: {
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    fontSize: 16,
  },
}); 