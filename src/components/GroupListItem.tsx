import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useGroup } from '../hooks/useGroup';
import { PinButton } from './PinButton';
import PinText from './PinText';

type GroupStatus = 'public' | 'private';

interface GroupListItemProps {
  id: string;
  name: string;
  memberCount: number;
  status: GroupStatus;
  imageUrl?: string;
  isMember?: boolean;
  onPress: () => void;
  onJoinSuccess?: () => void;
}

export function GroupListItem({
  id,
  name,
  memberCount,
  status,
  imageUrl,
  isMember = false,
  onPress,
  onJoinSuccess,
}: GroupListItemProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isJoining, joinGroup } = useGroup();

  const handleJoin = async () => {
    const success = await joinGroup(id);
    if (success && onJoinSuccess) {
      onJoinSuccess();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.border }]}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" size={24} color={theme.colors.text} />
          )}
        </View>
        <View style={styles.info}>
          <PinText style={[styles.name, { color: theme.colors.text }]}>
            {name}
          </PinText>
          <View style={styles.details}>
            <View style={styles.memberCount}>
              <Ionicons name="people-outline" size={16} color={theme.colors.text} />
              <PinText style={[styles.memberCountText, { color: theme.colors.text }]}>
                {memberCount} {memberCount === 1 ? t('groups.member') : t('groups.members')}
              </PinText>
            </View>
            <View style={styles.status}>
              <Ionicons
                name={status === 'public' ? 'globe-outline' : 'lock-closed-outline'}
                size={16}
                color={theme.colors.text}
              />
              <PinText style={[styles.statusText, { color: theme.colors.text }]}>
                {t(`groups.${status}`)}
              </PinText>
            </View>
          </View>
        </View>
        {status === 'public' && !isMember && (
          <PinButton
            variant="pill"
            onPress={handleJoin}
            loading={isJoining}
            disabled={isJoining}
          >
            {t('groups.join')}
          </PinButton>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberCountText: {
    fontSize: 14,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
  },
}); 