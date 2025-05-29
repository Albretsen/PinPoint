import Card from '@/src/components/Card';
import { useTheme } from '@/src/context/ThemeProvider';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Group = {
  id: string;
  name: string;
  is_public: boolean;
  invite_code: string | null;
  owner_id: string;
  created_at: string;
  daily_challenge_time: string;
  is_archived: boolean;
  description: string;
  is_admin: boolean;
  joined_at: string;
  current_challenge?: {
    id: string;
    challenge_date: string;
    started_at: string;
    ended_at: string | null;
    image: {
      id: string;
      image_url: string;
      taken_at: string | null;
      uploader_id: string;
    };
  };
};

type GroupMember = {
  is_admin: boolean;
  joined_at: string;
  groups: {
    id: string;
    name: string;
    is_public: boolean;
    invite_code: string | null;
    owner_id: string;
    created_at: string;
    daily_challenge_time: string;
    is_archived: boolean;
    description: string;
    group_challenges: {
      id: string;
      challenge_date: string;
      started_at: string;
      ended_at: string | null;
      group_images: {
        id: string;
        image_url: string;
        taken_at: string | null;
        uploader_id: string;
      };
    }[];
  };
};

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

  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['groups', session?.user?.id],
    queryFn: () => fetchGroups(session!.user!.id),
    enabled: !!session?.user?.id,
  });

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
              : require('@/assets/images/partial-react-logo.png')
            }
            header={group.name}
            subheading={group.description}
            buttonLabel="Guess Location"
            onButtonPress={() => {}}
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