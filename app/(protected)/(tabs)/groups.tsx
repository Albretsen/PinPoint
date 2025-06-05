import { GroupListItem } from '@/src/components/GroupListItem';
import PinList from '@/src/components/PinList';
import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group, GroupMember } from '@/src/types/group';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
        cover_image,
        group_members (
          user_id
        )
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;

  // Get member counts for all groups
  const groups = (data as unknown as GroupMember[]).map(member => member.groups);
  const groupIds = groups.map(group => group.id);

  const memberCounts = await Promise.all(
    groupIds.map(async (groupId) => {
      const { count, error: countError } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);

      if (countError) throw countError;
      return { group_id: groupId, count: count || 0 };
    })
  );

  return (data as unknown as GroupMember[]).map(member => ({
    ...member.groups,
    is_admin: member.is_admin,
    joined_at: member.joined_at,
    member_count: memberCounts.find(count => count.group_id === member.groups.id)?.count || 0,
  }));
}

async function fetchPublicGroups(userId: string): Promise<Group[]> {
  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get member counts for all public groups
  const groupIds = groups.map(group => group.id);
  const memberCounts = await Promise.all(
    groupIds.map(async (groupId) => {
      const { count, error: countError } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);

      if (countError) throw countError;
      return { group_id: groupId, count: count || 0 };
    })
  );

  // Get user's membership status for each group
  const { data: userMemberships, error: membershipError } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId)
    .in('group_id', groupIds);

  if (membershipError) throw membershipError;

  return groups.map(group => ({
    ...group,
    member_count: memberCounts.find(count => count.group_id === group.id)?.count || 0,
    is_member: userMemberships?.some(m => m.group_id === group.id) || false,
  }));
}

export default function GroupsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { session } = useUserStore();

  const { data: myGroups, isLoading: isLoadingMyGroups, error: myGroupsError, refetch: refetchMyGroups } = useQuery({
    queryKey: ['myGroups', session?.user?.id],
    queryFn: () => fetchGroups(session!.user!.id),
    enabled: !!session?.user?.id,
  });

  const { data: publicGroups, isLoading: isLoadingPublicGroups, error: publicGroupsError, refetch: refetchPublicGroups } = useQuery({
    queryKey: ['publicGroups', session?.user?.id],
    queryFn: () => fetchPublicGroups(session!.user!.id),
    enabled: !!session?.user?.id,
  });

  const handleRefreshMyGroups = async () => {
    const result = await refetchMyGroups();
    return result.data || [];
  };

  const handleRefreshPublicGroups = async () => {
    const result = await refetchPublicGroups();
    return result.data || [];
  };

  const renderMyGroup = (group: Group) => (
    <GroupListItem
      key={group.id}
      id={group.id}
      name={group.name}
      memberCount={group.member_count || 0}
      status={group.is_public ? 'public' : 'private'}
      imageUrl={group.cover_image || undefined}
      isMember={true} // Always true for my groups
      onPress={() => router.push({
        pathname: '/(protected)/group/[id]',
        params: { 
          id: group.id,
          initialData: JSON.stringify({
            ...group,
            member_count: group.member_count || 0
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
            member_count: group.member_count || 0
          })
        }
      })}
      onJoinSuccess={() => {
        // Refetch groups to update the list
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
          data={myGroups || []}
          renderItem={renderMyGroup}
          fetchData={handleRefreshMyGroups}
          isLoading={isLoadingMyGroups}
          error={myGroupsError as Error}
          emptyMessage={t('groups.noGroups')}
          keyExtractor={(item) => item.id}
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
          data={publicGroups || []}
          renderItem={renderPublicGroup}
          fetchData={handleRefreshPublicGroups}
          isLoading={isLoadingPublicGroups}
          error={publicGroupsError as Error}
          emptyMessage={t('groups.noPublicGroups')}
          keyExtractor={(item) => item.id}
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