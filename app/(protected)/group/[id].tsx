import { GroupChallenge } from '@/src/components/GroupChallenge';
import { LeaderboardSection } from '@/src/components/LeaderboardSection';
import PinText from '@/src/components/PinText';
import { usePinToast } from '@/src/components/PinToast';
import { useTheme } from '@/src/context/ThemeProvider';
import { useGroup } from '@/src/hooks/useGroup';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group } from '@/src/types/group';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu';

const { Popover } = renderers;
const { width } = Dimensions.get('window');

async function fetchGroupDetails(groupId: string): Promise<Group> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      group_members (
        user_id
      ),
      group_challenges!inner (
        id,
        challenge_date,
        started_at,
        ended_at,
        group_images (
          id,
          storage_path,
          taken_at,
          uploader_id
        )
      )
    `)
    .eq('id', groupId)
    .eq('group_challenges.challenge_date', today)
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
  const { id, initialData } = useLocalSearchParams<{ id: string; initialData?: string }>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useUserStore();
  const { isLeaving, leaveGroup, isJoining, joinGroup } = useGroup();
  const { showToast } = usePinToast();

  const [group, setGroup] = useState<Group | null>(initialData ? JSON.parse(initialData) : null);
  const [isMember, setIsMember] = useState<boolean>(false);

  const fetchGroup = async () => {
    // First get the group details
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();

    if (groupError) {
      console.error('Error fetching group:', groupError);
      return;
    }

    // Then get the member count
    const { count, error: countError } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', id);

    if (countError) {
      console.error('Error fetching member count:', countError);
      return;
    }

    // Check if user is a member
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', id)
      .eq('user_id', session?.user?.id)
      .single();

    if (membershipError && membershipError.code !== 'PGRST116') {
      console.error('Error checking membership:', membershipError);
      return;
    }

    setGroup({
      ...groupData,
      member_count: count || 0
    });
    setIsMember(!!membership);
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchGroup();
      }
    }, [id])
  );

  // Initial fetch
  useEffect(() => {
    if (id) {
      fetchGroup();
    }
  }, [id]);

  const handleLeaveGroup = async () => {
    if (!id) return;
    
    const success = await leaveGroup(id);
    if (success) {
      router.back();
    }
  };

  const handleJoinGroup = async () => {
    if (!id) return;
    
    const success = await joinGroup(id);
    if (success) {
      setIsMember(true);
      // Refetch group to update member count
      fetchGroup();
    }
  };

  if (!group) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <PinText>Loading...</PinText>
      </View>
    );
  }

  const memberCount = group.member_count || 0;
  const memberText = memberCount === 1 ? t('groups.member') : t('groups.members');

  const menuOptions = [
    {
      label: t('groups.viewMembers'),
      icon: 'people-outline',
      onPress: () => router.push(`/(protected)/group/members?id=${id}`),
    },
    {
      label: t('groups.leaveGroup'),
      icon: 'exit-outline',
      onPress: handleLeaveGroup,
      destructive: true,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: t('navigation.back'),
          headerRight: () => (
            <Menu renderer={Popover} rendererProps={{ placement: 'bottom' }}>
              <MenuTrigger customStyles={{
                triggerWrapper: {
                  padding: 8,
                },
              }}>
                <PinText style={[styles.menuButton, { color: theme.colors.text }]}>⋮</PinText>
              </MenuTrigger>
              <MenuOptions customStyles={{
                optionsWrapper: {
                  backgroundColor: theme.colors.card,
                  borderRadius: 8,
                  padding: 4,
                },
                optionWrapper: {
                  padding: 8,
                },
              }}>
                {isMember ? (
                  menuOptions.map((option, index) => (
                    <MenuOption
                      key={index}
                      onSelect={option.onPress}
                      disabled={isLeaving}
                      customStyles={{
                        optionWrapper: {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        },
                      }}
                    >
                      <Ionicons
                        name={option.icon as any}
                        size={20}
                        color={option.destructive ? theme.colors.error : theme.colors.text}
                      />
                      <PinText style={{ color: option.destructive ? theme.colors.error : theme.colors.text }}>
                        {option.label}
                      </PinText>
                    </MenuOption>
                  ))
                ) : (
                  <MenuOption onSelect={handleJoinGroup} disabled={isJoining} customStyles={{
                    optionWrapper: {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    },
                  }}>
                    <Ionicons name="add-circle-outline" size={20} color={theme.colors.text} />
                    <PinText style={{ color: theme.colors.text }}>
                      {isJoining ? t('groups.joining') : t('groups.joinGroup')}
                    </PinText>
                  </MenuOption>
                )}
              </MenuOptions>
            </Menu>
          ),
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
                {memberCount} {memberText}
              </PinText>
            </View>
          </View>
        </View>

        {/* Daily Challenge */}
        <GroupChallenge
          groupId={group.id}
          dailyChallengeTime={group.daily_challenge_time || '12:00:00'}
          preloadedChallenge={group.group_challenges?.[0] ? {
            id: group.group_challenges[0].id,
            challenge_date: group.group_challenges[0].challenge_date,
            started_at: group.group_challenges[0].started_at,
            ended_at: group.group_challenges[0].ended_at,
            group_images: group.group_challenges[0].group_images
          } : undefined}
        />

        {/* Leaderboard Section */}
        <LeaderboardSection groupId={group.id} />
      </ScrollView>
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
  menuButton: {
    fontSize: 24,
    padding: 8,
  },
}); 