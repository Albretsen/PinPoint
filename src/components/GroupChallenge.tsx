import { PinButton } from '@/src/components/PinButton';
import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

interface GroupChallengeProps {
  groupId: string;
  dailyChallengeTime: string;
  preloadedChallenge?: {
    id: string;
    image_id: string;
    challenge_date: string;
    started_at: string;
    ended_at: string;
    group_images: {
      image_url: string;
    };
  };
}

interface ChallengeGuess {
  id: string;
  user_id: string;
  distance_meters: number;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface GroupChallenge {
  id: string;
  image_id: string;
  challenge_date: string;
  started_at: string;
  ended_at: string;
  group_images: {
    image_url: string;
  };
}

function SkeletonLoader() {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, []);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Animated.View 
        style={[
          styles.imageContainer,
          { backgroundColor: theme.colors.border },
          { opacity }
        ]} 
      />
    </View>
  );
}

function calculateTimeUntilNext(dailyChallengeTime: string): string {
  const now = new Date();
  const [hours, minutes, seconds] = dailyChallengeTime.split(':').map(Number);
  
  // Create a Date object for today's challenge time
  const challengeTime = new Date(now);
  challengeTime.setUTCHours(hours, minutes, seconds, 0);

  // If the challenge time has already passed today, calculate for tomorrow
  if (now > challengeTime) {
    challengeTime.setUTCDate(challengeTime.getUTCDate() + 1);
  }

  const diff = challengeTime.getTime() - now.getTime();
  const remainingHours = Math.floor(diff / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${remainingHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function GroupChallenge({ groupId, dailyChallengeTime, preloadedChallenge }: GroupChallengeProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { session } = useUserStore();
  const [challenge, setChallenge] = useState<GroupChallenge | null>(preloadedChallenge || null);
  const [userGuess, setUserGuess] = useState<ChallengeGuess | null>(null);
  const [topGuesses, setTopGuesses] = useState<ChallengeGuess[]>([]);
  const [timeUntilNext, setTimeUntilNext] = useState<string>(() => calculateTimeUntilNext(dailyChallengeTime));
  const [isLoading, setIsLoading] = useState(!preloadedChallenge);

  useEffect(() => {
    verifyChallenge();
    const interval = setInterval(() => {
      setTimeUntilNext(calculateTimeUntilNext(dailyChallengeTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [groupId, dailyChallengeTime]);

  const verifyChallenge = async () => {
    try {
      // Get today's challenge
      const today = new Date().toISOString().split('T')[0];
      const { data: challengeData, error: challengeError } = await supabase
        .from('group_challenges')
        .select(`
          id,
          started_at,
          ended_at
        `)
        .eq('group_id', groupId)
        .eq('challenge_date', today)
        .single();

      if (challengeError) {
        if (challengeError.code === 'PGRST116') {
          // No challenge found for today
          setChallenge(null);
          setIsLoading(false);
          return;
        }
        throw challengeError;
      }

      // If we have preloaded data and the challenge hasn't changed, keep using it
      if (preloadedChallenge && 
          challengeData.id === preloadedChallenge.id && 
          challengeData.started_at === preloadedChallenge.started_at && 
          challengeData.ended_at === preloadedChallenge.ended_at) {
        setIsLoading(false);
        return;
      }

      // If the challenge has changed, fetch the full data
      const { data: fullChallengeData, error: fullError } = await supabase
        .from('group_challenges')
        .select(`
          *,
          group_images (
            image_url
          )
        `)
        .eq('id', challengeData.id)
        .single();

      if (fullError) throw fullError;
      setChallenge(fullChallengeData);

      // Fetch user's guess and top guesses
      await Promise.all([
        fetchUserGuess(fullChallengeData.id),
        fetchTopGuesses(fullChallengeData.id)
      ]);
    } catch (error) {
      console.error('Error verifying challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserGuess = async (challengeId: string) => {
    const { data: guessData, error: guessError } = await supabase
      .from('challenge_guesses')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('challenge_id', challengeId)
      .eq('user_id', session?.user?.id)
      .single();

    if (!guessError) {
      setUserGuess(guessData);
    }
  };

  const fetchTopGuesses = async (challengeId: string) => {
    const { data: topGuessesData, error: topGuessesError } = await supabase
      .from('challenge_guesses')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('challenge_id', challengeId)
      .order('distance_meters', { ascending: true })
      .limit(3);

    if (!topGuessesError) {
      setTopGuesses(topGuessesData);
    }
  };

  const handleGuess = () => {
    // TODO: Implement guess location functionality
    // This should navigate to a map screen where the user can place their guess
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Return null if there's no challenge today
  if (!challenge) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {/* Challenge Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: challenge.group_images.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Ionicons name="time-outline" size={20} color={theme.colors.text} />
        <PinText style={[styles.timerText, { color: theme.colors.text }]}>
          {t('challenge.timeRemaining')}: {timeUntilNext}
        </PinText>
      </View>

      {/* User's Guess or Guess Button */}
      {userGuess ? (
        <View style={styles.guessContainer}>
          <PinText style={[styles.guessText, { color: theme.colors.text }]}>
            {t('challenge.yourGuess')}: {Math.round(userGuess.distance_meters)} {t('challenge.meters')}
          </PinText>
        </View>
      ) : (
        <PinButton
          onPress={handleGuess}
          style={styles.guessButton}
        >
          {t('challenge.guessLocation')}
        </PinButton>
      )}

      {/* Top 3 */}
      {topGuesses.length > 0 && (
        <View style={styles.topGuessesContainer}>
          <PinText style={[styles.topGuessesTitle, { color: theme.colors.text }]}>
            {t('challenge.topGuesses')}
          </PinText>
          {topGuesses.map((guess, index) => (
            <View key={guess.id} style={styles.topGuessItem}>
              <PinText style={[styles.rank, { color: theme.colors.text }]}>
                #{index + 1}
              </PinText>
              <PinText style={[styles.username, { color: theme.colors.text }]}>
                {guess.profiles.username}
              </PinText>
              <PinText style={[styles.distance, { color: theme.colors.text }]}>
                {Math.round(guess.distance_meters)} {t('challenge.meters')}
              </PinText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  guessContainer: {
    padding: 12,
    alignItems: 'center',
  },
  guessText: {
    fontSize: 16,
    fontWeight: '600',
  },
  guessButton: {
    margin: 12,
  },
  topGuessesContainer: {
    padding: 12,
  },
  topGuessesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  topGuessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  rank: {
    fontSize: 16,
    fontWeight: '600',
    width: 40,
  },
  username: {
    flex: 1,
    fontSize: 16,
  },
  distance: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 