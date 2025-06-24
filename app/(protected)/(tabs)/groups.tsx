import { GroupListItem } from '@/src/components/GroupListItem';
import { PinButton } from '@/src/components/PinButton';
import PinList from '@/src/components/PinList';
import PinText from '@/src/components/PinText';
import SearchAndSortHeader, { SortOption } from '@/src/components/SearchAndSortHeader';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group } from '@/src/types/group';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

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

  // Invite code functionality
  const [inviteCode, setInviteCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [foundGroup, setFoundGroup] = useState<Group | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

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

  // Invite code validation function
  const validateInviteCode = async (code: string) => {
    if (!code.trim() || !session?.user?.id) return;
    
    setIsValidatingCode(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(user_id)
        `)
        .eq('invite_code', code.toUpperCase())
        .eq('group_members.user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // User is already a member
        setFoundGroup(null);
        return;
      }

      // Check if group exists and user is not a member
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', code.toUpperCase())
        .single();

      if (groupError) {
        setFoundGroup(null);
        return;
      }

      // Get member count
      const { count, error: countError } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupData.id);

      if (countError) {
        setFoundGroup(null);
        return;
      }

      setFoundGroup({
        ...groupData,
        member_count: count || 0
      });
      setShowJoinModal(true);
    } catch (error) {
      console.error('Error validating invite code:', error);
      setFoundGroup(null);
    } finally {
      setIsValidatingCode(false);
    }
  };

  // Handle joining group via invite code
  const handleJoinGroupViaCode = async () => {
    if (!foundGroup || !session?.user?.id) return;
    
    setIsJoining(true);
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: foundGroup.id,
          user_id: session.user.id,
          is_admin: false,
        });

      if (error) throw error;

      // Close modal and refresh lists
      setShowJoinModal(false);
      setInviteCode('');
      setFoundGroup(null);
      refetchMyGroups();
      refetchPublicGroups();
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setIsJoining(false);
    }
  };

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
        {/* Invite Code Input */}
        <View style={[styles.inviteCodeContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="key-outline" size={20} color={theme.colors.text} style={styles.inviteCodeIcon} />
          <TextInput
            placeholder={t('groups.joinByInviteCode')}
            placeholderTextColor={theme.colors.text + '80'}
            value={inviteCode}
            onChangeText={(text: string) => {
              setInviteCode(text.toUpperCase());
              if (text.length === 6) {
                validateInviteCode(text);
              } else {
                setFoundGroup(null);
              }
            }}
            maxLength={6}
            autoCapitalize="characters"
            autoCorrect={false}
            style={[styles.inviteCodeInput, { color: theme.colors.text }]}
          />
          {isValidatingCode && (
            <Ionicons name="hourglass-outline" size={20} color={theme.colors.primary} style={styles.inviteCodeIcon} />
          )}
          {inviteCode.length === 6 && !isValidatingCode && !foundGroup && (
            <Ionicons name="close-circle" size={20} color={theme.colors.error} style={styles.inviteCodeIcon} />
          )}
          {foundGroup && (
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} style={styles.inviteCodeIcon} />
          )}
        </View>

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

      {/* Join Group Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowJoinModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            {foundGroup && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.groupImageContainer, { backgroundColor: theme.colors.border }]}>
                    {foundGroup.cover_image ? (
                      <Image source={{ uri: foundGroup.cover_image }} style={styles.groupImage} />
                    ) : (
                      <Ionicons name="image-outline" size={40} color={theme.colors.text} />
                    )}
                  </View>
                  <View style={styles.groupInfo}>
                    <PinText style={[styles.groupName, { color: theme.colors.text }]}>
                      {foundGroup.name}
                    </PinText>
                    <PinText style={[styles.groupDescription, { color: theme.colors.text }]}>
                      {foundGroup.description}
                    </PinText>
                    <View style={styles.groupStats}>
                      <Ionicons name="people-outline" size={16} color={theme.colors.text} />
                      <PinText style={[styles.groupStatsText, { color: theme.colors.text }]}>
                        {foundGroup.member_count} {foundGroup.member_count === 1 ? t('groups.member') : t('groups.members')}
                      </PinText>
                      <Ionicons 
                        name={foundGroup.is_public ? 'globe-outline' : 'lock-closed-outline'} 
                        size={16} 
                        color={foundGroup.is_public ? theme.colors.primary : theme.colors.text} 
                      />
                      <PinText style={[styles.groupStatsText, { color: theme.colors.text }]}>
                        {foundGroup.is_public ? t('groups.public') : t('groups.private')}
                      </PinText>
                    </View>
                  </View>
                </View>
                <View style={styles.modalButtons}>
                  <PinButton
                    variant="outline"
                    onPress={() => setShowJoinModal(false)}
                    disabled={isJoining}
                    style={styles.modalButton}
                  >
                    {t('common.cancel')}
                  </PinButton>
                  <PinButton
                    variant="primary"
                    onPress={handleJoinGroupViaCode}
                    loading={isJoining}
                    disabled={isJoining}
                    style={styles.modalButton}
                  >
                    {t('groups.joinGroup')}
                  </PinButton>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/(protected)/create-group/basic-info')}
      >
        <Ionicons name="add" size={24} color={theme.colors.background} />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inviteCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  inviteCodeIcon: {
    marginRight: 8,
  },
  inviteCodeInput: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    width: '100%',
  },
  groupImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  groupInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  groupDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 18,
  },
  groupStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupStatsText: {
    fontSize: 13,
    opacity: 0.8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
}); 