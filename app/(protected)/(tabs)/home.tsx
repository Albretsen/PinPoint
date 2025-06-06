import Card from '@/src/components/Card';
import PinList from '@/src/components/PinList';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group, GroupMember } from '@/src/types/group';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';

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
        group_challenges (
          id,
          challenge_date,
          started_at,
          ended_at,
          group_images (
            id,
            image_url,
            taken_at,
            uploader_id
          )
        )
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;

  return (data as unknown as GroupMember[]).map(member => {
    const currentChallenge = member.groups.group_challenges?.[0];
    return {
      ...member.groups,
      is_admin: member.is_admin,
      joined_at: member.joined_at,
      current_challenge: currentChallenge ? {
        id: currentChallenge.id,
        challenge_date: currentChallenge.challenge_date,
        started_at: currentChallenge.started_at,
        ended_at: currentChallenge.ended_at,
        image: currentChallenge.group_images
      } : undefined
    };
  });
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { session } = useUserStore();
  const router = useRouter();
  const { t } = useTranslation();

  const { data: groups, isLoading, error, refetch } = useQuery({
    queryKey: ['groups', session?.user?.id],
    queryFn: () => fetchGroups(session!.user!.id),
    enabled: !!session?.user?.id,
  });

  const handleCardPress = (imageUrl: string) => {
    router.push({
      pathname: '/(protected)/guess',
      params: { imageUrl }
    });
  };

  const handleRefresh = async () => {
    const result = await refetch();
    return result.data || [];
  };

  const renderGroup = (group: Group) => {
    // Determine the image source
    let imageSource: ImageSourcePropType | undefined;
    if (group.current_challenge?.image?.image_url) {
      imageSource = { uri: group.current_challenge.image.image_url };
    } else if (group.cover_image) {
      imageSource = { uri: group.cover_image };
    }

    return (
    <Card
      key={group.id}
        image={imageSource}
      header={group.name}
      subheading={group.description}
      buttonLabel={t('home.guessLocation')}
      onButtonPress={() => {}}
      onPress={() => {
        if (group.current_challenge?.image?.image_url) {
          handleCardPress(group.current_challenge.image.image_url);
        }
      }}
    />
  );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinList
        data={groups || []}
        renderItem={renderGroup}
        fetchData={handleRefresh}
        isLoading={isLoading}
        error={error as Error}
        emptyMessage={t('home.noGroups')}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 