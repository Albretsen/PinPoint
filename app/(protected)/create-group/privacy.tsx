import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ name: string; description: string }>();
  const [isPublic, setIsPublic] = useState(true);
  const [inviteCode, setInviteCode] = useState(generateInviteCode());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [challengeTime, setChallengeTime] = useState(new Date());

  function generateInviteCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const handleCopyInviteCode = async () => {
    await Clipboard.setStringAsync(inviteCode);
    // TODO: Show toast
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setChallengeTime(selectedTime);
    }
  };

  const handleNext = () => {
    router.push({
      pathname: '/(protected)/create-group/preview',
      params: {
        ...params,
        isPublic: isPublic.toString(),
        inviteCode,
        challengeTime: challengeTime.toISOString(),
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        {t('groups.create.privacy.title')}
      </PinText>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.sectionHeader}>
          <View>
            <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('groups.create.privacy.public')}
            </PinText>
            <PinText style={[styles.sectionDescription, { color: theme.colors.text }]}>
              {t('groups.create.privacy.publicDescription')}
            </PinText>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
      </View>

      {!isPublic && (
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('groups.create.privacy.inviteCode')}
          </PinText>
          <TouchableOpacity
            style={[styles.inviteCodeContainer, { backgroundColor: theme.colors.background }]}
            onPress={handleCopyInviteCode}
          >
            <PinText style={[styles.inviteCode, { color: theme.colors.text }]}>
              {inviteCode}
            </PinText>
            <Ionicons name="copy-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('groups.create.privacy.dailyChallengeTime')}
        </PinText>
        <TouchableOpacity
          style={[styles.timeButton, { backgroundColor: theme.colors.background }]}
          onPress={() => setShowTimePicker(true)}
        >
          <PinText style={[styles.timeText, { color: theme.colors.text }]}>
            {challengeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </PinText>
          <Ionicons name="time-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={challengeTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleNext}
        >
          <PinText style={[styles.buttonText, { color: theme.colors.background }]}>
            {t('navigation.next')}
          </PinText>
        </TouchableOpacity>
      </View>
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
    fontWeight: 'bold',
    marginBottom: 30,
  },
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  inviteCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  inviteCode: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 