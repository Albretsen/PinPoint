import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
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
  const [secureImageUrl, setSecureImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchSecureUrl = async () => {
      if (!imageUrl) return;

      const { data } = await supabase.storage
        .from('photos')
        .createSignedUrl(imageUrl, 3600);

      if (data?.signedUrl) {
        setSecureImageUrl(data.signedUrl);
      } else {
        setImageError(true);
      }
    };

    fetchSecureUrl();
  }, [imageUrl]);

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
      <View style={[styles.imageContainer, { backgroundColor: theme.colors.border }]}>
        {secureImageUrl && !imageError ? (
          <Image
            source={{ uri: secureImageUrl }}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        ) : (
          <Ionicons name="image-outline" size={24} color={theme.colors.text} />
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.header}>
          <PinText style={[styles.name, { color: theme.colors.text }]}>
            {name}
          </PinText>
          <View style={styles.memberCount}>
            <Ionicons name="people-outline" size={16} color={theme.colors.text} />
            <PinText style={[styles.memberCountText, { color: theme.colors.text }]}>
              {memberCount} {memberCount === 1 ? t('groups.member') : t('groups.members')}
            </PinText>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.leftColumn}>

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

          {status === 'public' && !isMember && (
            <View style={styles.joinButtonContainer}>
              <PinButton
                variant='secondary'
                onPress={handleJoin}
                loading={isJoining}
                disabled={isJoining}
              >
                {t('groups.join')}
              </PinButton>
            </View>
          )}
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'column',
  },

  imageContainer: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    flexShrink: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  leftColumn: {
    flexDirection: 'column',
    gap: 4,
    flexShrink: 1,
  },
  joinButtonContainer: {
    justifyContent: 'flex-start',
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
    color: '#eee',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#eee',
  },
});
