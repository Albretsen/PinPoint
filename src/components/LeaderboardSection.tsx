import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import PinText from './PinText';

type TimeFilter = 'today' | 'week' | 'month' | 'allTime';

// Placeholder data for leaderboard
const placeholderLeaderboardData = [
  { id: '1', username: 'JohnDoe', avatarUrl: null, score: 9500, isCurrentUser: false },
  { id: '2', username: 'JaneSmith', avatarUrl: null, score: 9200, isCurrentUser: true },
  { id: '3', username: 'MikeJohnson', avatarUrl: null, score: 8900, isCurrentUser: false },
  { id: '4', username: 'SarahWilson', avatarUrl: null, score: 8700, isCurrentUser: false },
  { id: '5', username: 'TomBrown', avatarUrl: null, score: 8500, isCurrentUser: false },
];

export function LeaderboardSection() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('today');

  const filters: { id: TimeFilter; label: string }[] = [
    { id: 'today', label: t('leaderboard.today') },
    { id: 'week', label: t('leaderboard.thisWeek') },
    { id: 'month', label: t('leaderboard.thisMonth') },
    { id: 'allTime', label: t('leaderboard.allTime') },
  ];

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
        {placeholderLeaderboardData.map((player, index) => (
          <View
            key={player.id}
            style={[
              styles.leaderboardItem,
              player.isCurrentUser && { backgroundColor: theme.colors.primary + '20' }
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
        ))}
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
}); 