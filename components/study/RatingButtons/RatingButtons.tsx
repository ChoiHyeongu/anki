import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { Rating, RatingButtonsProps } from './RatingButtons.type';

const RATING_CONFIG: Record<Rating, { label: string; color: string }> = {
  again: { label: '다시', color: '#ff5252' },
  hard: { label: '어려움', color: '#ffa726' },
  good: { label: '알맞음', color: '#13ec5b' },
  easy: { label: '쉬움', color: '#42a5f5' },
};

const RATINGS: Rating[] = ['again', 'hard', 'good', 'easy'];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RatingButtonProps {
  rating: Rating;
  interval?: string;
  onPress: () => void;
  disabled: boolean;
}

function RatingButton({
  rating,
  interval,
  onPress,
  disabled,
}: RatingButtonProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const config = RATING_CONFIG[rating];
  const scale = useSharedValue(1);
  const isPressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: isPressed.value ? `${config.color}33` : colors.surface,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    isPressed.value = true;
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    isPressed.value = false;
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <View style={styles.buttonWrapper}>
      {interval && (
        <ThemedText style={[styles.interval, { color: colors.textMuted }]}>
          {interval}
        </ThemedText>
      )}
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.button,
          animatedStyle,
          { opacity: disabled ? 0.5 : 1 },
        ]}
      >
        <ThemedText style={[styles.label, { color: config.color }]}>
          {config.label}
        </ThemedText>
      </AnimatedPressable>
    </View>
  );
}

export function RatingButtons({
  onRate,
  intervals,
  disabled = false,
}: RatingButtonsProps) {
  return (
    <View style={styles.container}>
      {RATINGS.map((rating) => (
        <RatingButton
          key={rating}
          rating={rating}
          interval={intervals?.[rating]}
          onPress={() => onRate(rating)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 48,
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  interval: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    marginBottom: 4,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
});
