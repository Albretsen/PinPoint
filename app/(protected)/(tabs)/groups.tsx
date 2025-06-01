import { GroupListItem } from '@/src/components/GroupListItem';
import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function GroupsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const myGroups = [{
    id: '1',
    name: 'My Group',
    is_public: false,
    imageUrl: undefined,
    memberCount: 5
  }];

  const publicGroups = [{
    id: '2',
    name: 'Public Group',
    is_public: true,
    imageUrl: undefined,
    memberCount: 10
  }];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>  
      {/* My Groups Section */}
      <View style={styles.section}>
        <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('groups.myGroups')}
        </PinText>
        <ScrollView style={styles.scrollView}>
          {myGroups.map((group) => (
            <GroupListItem
              key={group.id}
              name={group.name}
              memberCount={group.memberCount}
              status={group.is_public ? 'public' : 'private'}
              imageUrl={group.imageUrl}
            />
          ))}
        </ScrollView>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      {/* Discover Public Groups Section */}
      <View style={styles.section}>
        <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('groups.discoverPublicGroups')}
        </PinText>
        <ScrollView style={styles.scrollView}>
          {publicGroups.map((group) => (
            <GroupListItem
              key={group.id}
              name={group.name}
              memberCount={group.memberCount}
              status={group.is_public ? 'public' : 'private'}
              imageUrl={group.imageUrl}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
}); 