import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PinText from './PinText';

type GroupStatus = 'public' | 'private' | 'trending';

interface GroupListItemProps {
  name: string;
  memberCount: number;
  status: GroupStatus;
  lastActivity?: string;
  imageUrl?: string;
  onPress?: () => void;
}

export function GroupListItem({ name, memberCount, status, lastActivity, imageUrl, onPress }: GroupListItemProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getStatusIcon = () => {
    switch (status) {
      case 'public':
        return 'globe-outline';
      case 'private':
        return 'lock-closed-outline';
      case 'trending':
        return 'trending-up-outline';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'public':
        return theme.colors.primary;
      case 'private':
        return theme.colors.text;
      case 'trending':
        return theme.colors.success;
    }
  };

  const getMemberText = (count: number) => {
    return count === 1 ? t('groups.member') : t('groups.members');
  };

  const content = (
    <>
      {/* Left side - Image or Placeholder */}
      <View style={[styles.imageContainer, { backgroundColor: theme.colors.border }]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={24} color={theme.colors.text} />
        )}
      </View>

      {/* Right side - Text content */}
      <View style={styles.contentContainer}>
        {/* Group name */}
        <PinText style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
          {name}
        </PinText>

        {/* Status and member count */}
        <View style={styles.statusRow}>
          <Ionicons name={getStatusIcon()} size={16} color={getStatusColor()} />
          <PinText style={[styles.memberCount, { color: theme.colors.text }]}>
            {memberCount} {getMemberText(memberCount)}
          </PinText>
        </View>

        {/* Last activity */}
        {lastActivity && (
          <PinText style={[styles.lastActivity, { color: theme.colors.secondary }]} numberOfLines={1}>
            {lastActivity}
          </PinText>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.colors.card }]}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    marginLeft: 6,
  },
  lastActivity: {
    fontSize: 12,
  },
}); 