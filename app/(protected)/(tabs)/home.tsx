import Card from '@/src/components/Card';
import { useTheme } from '@/src/context/ThemeProvider';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Group, GroupMember } from '@/src/types/group';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

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

  const { data: groups, isLoading, error } = useQuery({
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

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error instanceof Error ? error.message : 'Failed to fetch groups'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {!groups || groups.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          You haven't joined any groups yet
        </Text>
      ) : (
        groups.map((group) => (
          <Card
            key={group.id}
            image={group.current_challenge?.image?.image_url 
              ? { uri: group.current_challenge.image.image_url }
              : { uri: "" }
            }
            header={group.name}
            subheading={group.description}
            buttonLabel="Guess Location"
            onButtonPress={() => {}}
            onPress={() => {
              if (group.current_challenge?.image?.image_url) {
                handleCardPress(group.current_challenge.image.image_url);
              }
            }}
          />
        ))
      )}
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
    marginBottom: 20,
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
}); 