import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, View } from 'react-native';
import PinText from './PinText';

type TimeFilter = 'today' | 'week' | 'month' | 'allTime';

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  score: number;
  createdAt: string;
}

interface LeaderboardSectionProps {
  groupId: string;
}

function LeaderboardSkeletonRow() {
  const { theme } = useTheme();
  const [opacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[styles.leaderboardItem, { opacity }]}>
      <View style={styles.rankContainer}>
        <View style={[styles.skeleton, { width: 30, height: 20 }]} />
      </View>
      <View style={styles.avatarContainer}>
        <View style={[styles.skeleton, styles.avatarPlaceholder]} />
      </View>
      <View style={styles.playerInfo}>
        <View style={[styles.skeleton, { width: 120, height: 20 }]} />
      </View>
      <View style={styles.scoreContainer}>
        <View style={[styles.skeleton, { width: 60, height: 20 }]} />
      </View>
    </Animated.View>
  );
}

export function LeaderboardSection({ groupId }: LeaderboardSectionProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { session } = useUserStore();
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('today');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filters: { id: TimeFilter; label: string }[] = [
    { id: 'today', label: t('leaderboard.today') },
    { id: 'week', label: t('leaderboard.thisWeek') },
    { id: 'month', label: t('leaderboard.thisMonth') },
    { id: 'allTime', label: t('leaderboard.allTime') },
  ];

  useEffect(() => {
    fetchLeaderboardData(selectedFilter);
  }, [selectedFilter, groupId]);

  const fetchLeaderboardData = async (filter: TimeFilter) => {
    setIsLoading(true);
    try {
      const today = new Date();
      let startDate: Date;

      switch (filter) {
        case 'week':
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case 'allTime':
          startDate = new Date(0); // Beginning of time
          break;
        default:
          startDate = today;
      }

      const { data, error } = await supabase
        .rpc('get_group_leaderboard_cumulative', {
          p_group_id: groupId,
          p_start_date: startDate.toISOString().split('T')[0],
          p_time_filter: filter
        });

      if (error) throw error;

      // Transform the data
      const allGuesses = (data || [])
        .map((entry: any) => ({
          id: entry.id,
          userId: entry.user_id,
          username: entry.username || 'Anonymous',
          avatarUrl: entry.avatar_url || null,
          score: entry.total_score || 0,
          createdAt: entry.last_guess_at
        }))
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);

      setLeaderboardData(allGuesses);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.leaderboardContainer}>
      <PinText style={[styles.leaderboardTitle, { color: theme.colors.text }]}>
        {t('leaderboard.title')}
      </PinText>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <View
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && { backgroundColor: theme.colors.primary }
            ]}
          >
            <PinText
              style={[
                styles.filterChipText,
                { color: selectedFilter === filter.id ? '#fff' : theme.colors.text }
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </PinText>
          </View>
        ))}
      </ScrollView>

      {/* Leaderboard List */}
      <View style={styles.leaderboardList}>
        {isLoading ? (
          // Show 5 skeleton rows while loading
          Array(5).fill(0).map((_, index) => (
            <LeaderboardSkeletonRow key={index} />
          ))
        ) : leaderboardData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <PinText style={[styles.emptyText, { color: theme.colors.text }]}>
              {t('leaderboard.noData')}
            </PinText>
          </View>
        ) : (
          leaderboardData.map((player, index) => (
            <View
              key={player.id}
              style={[
                styles.leaderboardItem,
                player.userId === session?.user?.id && { backgroundColor: theme.colors.primary + '20' }
              ]}
            >
              <View style={styles.rankContainer}>
                <PinText style={[styles.rankText, { color: theme.colors.text }]}>
                  #{index + 1}
                </PinText>
              </View>
              <View style={styles.avatarContainer}>
                {player.avatarUrl ? (
                  <Image source={{ uri: player.avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
                    <Ionicons name="person" size={20} color={theme.colors.text} />
                  </View>
                )}
              </View>
              <View style={styles.playerInfo}>
                <PinText style={[styles.playerName, { color: theme.colors.text }]}>
                  {player.username}
                </PinText>
              </View>
              <View style={styles.scoreContainer}>
                <PinText style={[styles.scoreText, { color: theme.colors.text }]}>
                  {player.score.toLocaleString()}
                </PinText>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leaderboardContainer: {
    padding: 20,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterChipText: {
    fontSize: 14,
  },
  leaderboardList: {
    gap: 8,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
  },
  scoreContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  skeleton: {
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 