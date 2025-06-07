import { GroupListItem } from '@/src/components/GroupListItem';
import PinList from '@/src/components/PinList';
import PinText from '@/src/components/PinText';
import SearchAndSortHeader, { SortOption } from '@/src/components/SearchAndSortHeader';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group } from '@/src/types/group';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

async function fetchGroups(
  userId: string,
  page = 0,
  pageSize = 20,
  search?: string,
  sortBy: string = 'trending'
): Promise<{ data: Group[], hasMore: boolean }> {
  const { data, error } = await supabase.rpc('get_my_groups', {
    p_user_id: userId,
    p_search: search || null,
    p_sort_by: sortBy,
    p_page: page,
    p_page_size: pageSize
  });

  if (error) throw error;

  return {
    data: data as Group[],
    hasMore: data.length === pageSize
  };
}

async function fetchPublicGroups(
  userId: string,
  page = 0,
  pageSize = 20,
  search?: string,
  sortBy: string = 'trending'
): Promise<{ data: Group[], hasMore: boolean }> {
  const { data, error } = await supabase.rpc('get_public_groups', {
    p_user_id: userId,
    p_search: search || null,
    p_sort_by: sortBy,
    p_page: page,
    p_page_size: pageSize
  });

  if (error) throw error;

  return {
    data: data as Group[],
    hasMore: data.length === pageSize
  };
}

export default function GroupsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { session } = useUserStore();
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my');
  const [myGroupsPage, setMyGroupsPage] = useState(0);
  const [publicGroupsPage, setPublicGroupsPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>({
    id: 'trending',
    label: t('groups.sort.trending'),
    icon: 'trending-up',
  });

  const sortOptions: SortOption[] = useMemo(() => [
    {
      id: 'trending',
      label: t('groups.sort.trending'),
      icon: 'trending-up',
    },
    {
      id: 'members',
      label: t('groups.sort.members'),
      icon: 'people',
    },
    {
      id: 'new',
      label: t('groups.sort.new'),
      icon: 'time',
    },
  ], [t]);

  const { data: myGroupsData, isLoading: isLoadingMyGroups, error: myGroupsError, refetch: refetchMyGroups } = useQuery({
    queryKey: ['myGroups', session?.user?.id, myGroupsPage, searchQuery, selectedSort.id],
    queryFn: () => fetchGroups(session!.user!.id, myGroupsPage, 20, searchQuery, selectedSort.id),
    enabled: !!session?.user?.id,
  });

  const { data: publicGroupsData, isLoading: isLoadingPublicGroups, error: publicGroupsError, refetch: refetchPublicGroups } = useQuery({
    queryKey: ['publicGroups', session?.user?.id, publicGroupsPage, searchQuery, selectedSort.id],
    queryFn: () => fetchPublicGroups(session!.user!.id, publicGroupsPage, 20, searchQuery, selectedSort.id),
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setMyGroupsPage(0);
    setPublicGroupsPage(0);
  };

  const handleSort = (option: SortOption) => {
    setSelectedSort(option);
    setMyGroupsPage(0);
    setPublicGroupsPage(0);
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
      <View style={[styles.tabBar, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'my' && { borderBottomColor: theme.colors.primary }
          ]}
          onPress={() => setActiveTab('my')}
        >
          <PinText
            style={[
              styles.tabText,
              { color: activeTab === 'my' ? theme.colors.primary : theme.colors.text }
            ]}
          >
            {t('groups.myGroups')}
          </PinText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'public' && { borderBottomColor: theme.colors.primary }
          ]}
          onPress={() => setActiveTab('public')}
        >
          <PinText
            style={[
              styles.tabText,
              { color: activeTab === 'public' ? theme.colors.primary : theme.colors.text }
            ]}
          >
            {t('groups.discoverPublicGroups')}
          </PinText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <SearchAndSortHeader
          enableSearch={true}
          enableSorting={true}
          sortOptions={sortOptions}
          onSearch={handleSearch}
          onSort={handleSort}
          searchPlaceholder={t('groups.searchPlaceholder')}
          selectedSortOption={selectedSort}
          searchQuery={searchQuery}
        />
        {activeTab === 'my' ? (
          <PinList
            data={myGroupsData?.data || []}
            renderItem={renderMyGroup}
            fetchData={handleRefreshMyGroups}
            isLoading={isLoadingMyGroups}
            error={myGroupsError as Error}
            emptyMessage={
              searchQuery || selectedSort.id !== 'trending'
                ? t('groups.noGroupsFound')
                : t('groups.noGroupsJoined')
            }
            keyExtractor={(item) => item.id}
            onEndReached={handleLoadMoreMyGroups}
            hasMore={myGroupsData?.hasMore}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <PinList
            data={publicGroupsData?.data || []}
            renderItem={renderPublicGroup}
            fetchData={handleRefreshPublicGroups}
            isLoading={isLoadingPublicGroups}
            error={publicGroupsError as Error}
            emptyMessage={
              searchQuery || selectedSort.id !== 'trending'
                ? t('groups.noGroupsFound')
                : t('groups.noPublicGroups')
            }
            keyExtractor={(item) => item.id}
            onEndReached={handleLoadMorePublicGroups}
            hasMore={publicGroupsData?.hasMore}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
}); 