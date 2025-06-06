import PinList from '@/src/components/PinList';
import PinText from '@/src/components/PinText';
import { usePinToast } from '@/src/components/PinToast';
import { useTheme } from '@/src/context/ThemeProvider';
import { useGroup } from '@/src/hooks/useGroup';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

interface GroupMember {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  joinedAt: string;
}

interface MemberData {
  user_id: string;
  is_admin: boolean;
  joined_at: string;
  username: string | null;
  avatar_url: string | null;
}

export default function GroupMembersScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { session } = useUserStore();
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isKicking, kickMember } = useGroup();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { showToast } = usePinToast();

  const fetchMembers = async (pageNum = 0) => {
    try {
      setIsLoading(true);
      const pageSize = 20;
      const { data, error, count } = await supabase
        .rpc('get_group_members_with_profiles', {
          p_group_id: groupId,
          p_page: pageNum,
          p_page_size: pageSize
        });

      if (error) throw error;

      // Check if current user is admin
      const currentUserMember = data.find((member: MemberData) => member.user_id === session?.user?.id);
      setIsAdmin(currentUserMember?.is_admin || false);

      const transformedMembers = (data as unknown as MemberData[]).map((member: MemberData) => ({
        id: member.user_id,
        userId: member.user_id,
        username: member.username || 'Anonymous',
        avatarUrl: member.avatar_url || null,
        isAdmin: member.is_admin,
        joinedAt: member.joined_at
      }));

      if (pageNum === 0) {
        setMembers(transformedMembers);
      } else {
        setMembers(prev => [...prev, ...transformedMembers]);
      }

      setHasMore(data.length === pageSize);
    } catch (error) {
      console.error('Error fetching members:', error);
      showToast(t('error.somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const handleKickMember = async (userId: string) => {
    if (!isAdmin || !groupId) return;

    const success = await kickMember(groupId, userId);
    if (success) {
      // Remove member from local state
      setMembers(prev => prev.filter(member => member.userId !== userId));
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMembers(nextPage);
    }
  };

  const handleRefresh = async () => {
    setPage(0);
    await fetchMembers(0);
    return members;
  };

  const renderMember = (member: GroupMember) => (
    <View
      key={member.id}
      style={[
        styles.memberRow,
        member.userId === session?.user?.id && { backgroundColor: theme.colors.primary + '20' }
      ]}
    >
      <View style={styles.memberInfo}>
        <View style={styles.avatarContainer}>
          {member.avatarUrl ? (
            <Image source={{ uri: member.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
              <Ionicons name="person" size={20} color={theme.colors.text} />
            </View>
          )}
        </View>
        <View style={styles.memberDetails}>
          <PinText style={[styles.username, { color: theme.colors.text }]}>
            {member.username}
          </PinText>
          {member.isAdmin && (
            <PinText style={[styles.adminBadge, { color: theme.colors.primary }]}>
              {t('groups.admin')}
            </PinText>
          )}
        </View>
      </View>

      {isAdmin && member.userId !== session?.user?.id && (
        <Menu>
          <MenuTrigger>
            <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text} />
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
            <MenuOption onSelect={() => handleKickMember(member.userId)} disabled={isKicking}>
              <PinText style={{ color: theme.colors.error }}>
                {t('groups.kickMember')}
              </PinText>
            </MenuOption>
          </MenuOptions>
        </Menu>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t('groups.members'),
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <PinList
          data={members}
          renderItem={renderMember}
          fetchData={handleRefresh}
          isLoading={isLoading}
          emptyMessage={t('groups.noMembers')}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          hasMore={hasMore}
          error={null}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  adminBadge: {
    fontSize: 12,
    marginTop: 2,
  },
}); 