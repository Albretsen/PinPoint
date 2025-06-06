import { GroupListItem } from '@/src/components/GroupListItem';
import PinList from '@/src/components/PinList';
import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group, GroupMember } from '@/src/types/group';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

async function fetchGroups(userId: string, page = 0, pageSize = 20): Promise<{ data: Group[], hasMore: boolean }> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error, count } = await supabase
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
        cover_image,
        group_challenges (
          id,
          image_id,
          challenge_date,
          started_at,
          ended_at,
          group_images (
            image_url
          )
        )
      )
    `, { count: 'exact' })
    .eq('user_id', userId)
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (error) throw error;

  // Get member counts for all groups in a single query
  const groups = (data as unknown as GroupMember[]).map(member => member.groups).filter(Boolean);
  const groupIds = groups.map(group => group.id);

  const { data: memberCounts, error: countError } = await supabase.rpc('get_group_member_counts', {
    group_ids: groupIds
  });

  if (countError) throw countError;

  // Ensure memberCounts is an array and has the correct shape
  const memberCountArray = Array.isArray(memberCounts) ? memberCounts : [];
  const memberCountMap = new Map(
    memberCountArray.map((count: { group_id: string; member_count: number }) => [
      count.group_id,
      count.member_count
    ])
  );

  const transformedData = (data as unknown as GroupMember[])
    .filter(member => member.groups)
    .map(member => {
      const groupId = member.groups.id;
      const memberCount = memberCountMap.get(groupId);
      return {
        ...member.groups,
        cover_image: member.groups.cover_image || null,
        is_admin: member.is_admin,
        joined_at: member.joined_at,
        member_count: typeof memberCount === 'number' ? memberCount : 0,
      };
    });

  return {
    data: transformedData as unknown as Group[],
    hasMore: count ? count > (page + 1) * pageSize : false
  };
}

async function fetchPublicGroups(userId: string, page = 0, pageSize = 20): Promise<{ data: Group[], hasMore: boolean }> {
  const today = new Date().toISOString().split('T')[0];
  const { data: groups, error, count } = await supabase
    .from('groups')
    .select(`
      id,
      name,
      is_public,
      invite_code,
      owner_id,
      created_at,
      daily_challenge_time,
      is_archived,
      description,
      cover_image,
      group_challenges (
        id,
        image_id,
        challenge_date,
        started_at,
        ended_at,
        group_images (
          image_url
        )
      )
    `, { count: 'exact' })
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (error) throw error;

  // Get member counts and user's membership status in a single query
  const groupIds = groups.map(group => group.id);
  const { data: memberData, error: memberError } = await supabase.rpc('get_group_member_counts_and_status', {
    group_ids: groupIds,
    target_user_id: userId
  });

  if (memberError) throw memberError;

  // Ensure memberData is an array and has the correct shape
  const memberDataArray = Array.isArray(memberData) ? memberData : [];
  const memberMap = new Map(
    memberDataArray.map((data: { group_id: string; member_count: number; is_member: boolean }) => [
      data.group_id,
      {
        count: data.member_count,
        isMember: data.is_member
      }
    ])
  );

  const transformedData = groups.map(group => {
    const memberInfo = memberMap.get(group.id);
    return {
      ...group,
      member_count: memberInfo?.count ?? 0,
      is_member: memberInfo?.isMember ?? false,
    };
  });

  return {
    data: transformedData as unknown as Group[],
    hasMore: count ? count > (page + 1) * pageSize : false
  };
}

export default function GroupsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { session } = useUserStore();
  const [myGroupsPage, setMyGroupsPage] = useState(0);
  const [publicGroupsPage, setPublicGroupsPage] = useState(0);

  const { data: myGroupsData, isLoading: isLoadingMyGroups, error: myGroupsError, refetch: refetchMyGroups } = useQuery({
    queryKey: ['myGroups', session?.user?.id, myGroupsPage],
    queryFn: () => fetchGroups(session!.user!.id, myGroupsPage),
    enabled: !!session?.user?.id,
  });

  const { data: publicGroupsData, isLoading: isLoadingPublicGroups, error: publicGroupsError, refetch: refetchPublicGroups } = useQuery({
    queryKey: ['publicGroups', session?.user?.id, publicGroupsPage],
    queryFn: () => fetchPublicGroups(session!.user!.id, publicGroupsPage),
    enabled: !!session?.user?.id,
  });

  // Refresh both lists when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setMyGroupsPage(0);
      setPublicGroupsPage(0);
      refetchMyGroups();
      refetchPublicGroups();
    }, [refetchMyGroups, refetchPublicGroups])
  );

  const handleRefreshMyGroups = async () => {
    setMyGroupsPage(0);
    const result = await refetchMyGroups();
    return result.data?.data || [];
  };

  const handleRefreshPublicGroups = async () => {
    setPublicGroupsPage(0);
    const result = await refetchPublicGroups();
    return result.data?.data || [];
  };

  const handleLoadMoreMyGroups = () => {
    if (myGroupsData?.hasMore) {
      setMyGroupsPage(prev => prev + 1);
    }
  };

  const handleLoadMorePublicGroups = () => {
    if (publicGroupsData?.hasMore) {
      setPublicGroupsPage(prev => prev + 1);
    }
  };

  const renderMyGroup = (group: Group) => (
    <GroupListItem
      key={group.id}
      id={group.id}
      name={group.name}
      memberCount={group.member_count || 0}
      status={group.is_public ? 'public' : 'private'}
      imageUrl={group.cover_image || undefined}
      isMember={true}
      onPress={() => router.push({
        pathname: '/(protected)/group/[id]',
        params: { 
          id: group.id,
          initialData: JSON.stringify({
            ...group,
            member_count: group.member_count || 0,
            group_challenges: group.group_challenges || []
          })
        }
      })}
    />
  );

  const renderPublicGroup = (group: Group) => (
    <GroupListItem
      key={group.id}
      id={group.id}
      name={group.name}
      memberCount={group.member_count || 0}
      status={group.is_public ? 'public' : 'private'}
      imageUrl={group.cover_image || undefined}
      isMember={group.is_member}
      onPress={() => router.push({
        pathname: '/(protected)/group/[id]',
        params: { 
          id: group.id,
          initialData: JSON.stringify({
            ...group,
            member_count: group.member_count || 0,
            group_challenges: group.group_challenges || []
          })
        }
      })}
      onJoinSuccess={() => {
        refetchMyGroups();
        refetchPublicGroups();
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>  
      {/* My Groups Section */}
      <View style={styles.section}>
        <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('groups.myGroups')}
        </PinText>
        <PinList
          data={myGroupsData?.data || []}
          renderItem={renderMyGroup}
          fetchData={handleRefreshMyGroups}
          isLoading={isLoadingMyGroups}
          error={myGroupsError as Error}
          emptyMessage={t('groups.noGroups')}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMoreMyGroups}
          hasMore={myGroupsData?.hasMore}
        />
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      {/* Discover Public Groups Section */}
      <View style={styles.section}>
        <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('groups.discoverPublicGroups')}
        </PinText>
        <PinList
          data={publicGroupsData?.data || []}
          renderItem={renderPublicGroup}
          fetchData={handleRefreshPublicGroups}
          isLoading={isLoadingPublicGroups}
          error={publicGroupsError as Error}
          emptyMessage={t('groups.noPublicGroups')}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMorePublicGroups}
          hasMore={publicGroupsData?.hasMore}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
}); 