import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function SuccessScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withSpring(1);
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: withSpring(20 * (1 - opacity.value)) }],
  }));

  const handleViewGroup = () => {
    // First replace the entire create group flow with the groups screen
    router.replace('/(protected)/(tabs)/groups');
    // Then navigate to the specific group
    router.push(`/group/${groupId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.icon, iconStyle]}>
        <Ionicons name="checkmark-circle" size={80} color={theme.colors.primary} />
      </Animated.View>

      <Animated.View style={[styles.content, contentStyle]}>
        <PinText style={[styles.title, { color: theme.colors.text }]}>
          {t('groups.create.success.title')}
        </PinText>
        <PinText style={[styles.description, { color: theme.colors.secondary }]}>
          {t('groups.create.success.description')}
        </PinText>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleViewGroup}
        >
          <PinText style={[styles.buttonText, { color: theme.colors.background }]}>
            {t('groups.create.success.viewGroup')}
          </PinText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 