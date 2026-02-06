import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, FontFamily, Spacing } from '@/constants/theme';

import type { Rating, RatingButtonsProps } from './RatingButtons.type';

const RATING_CONFIG: Record<Rating, { label: string; color: string }> = {
  again: { label: '다시', color: '#dc2626' },
  hard: { label: '어려움', color: '#f59e0b' },
  good: { label: '알맞음', color: '#22c55e' },
  easy: { label: '쉬움', color: '#3b82f6' },
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
  const config = RATING_CONFIG[rating];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        animatedStyle,
        {
          backgroundColor: config.color,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <ThemedText style={styles.label}>{config.label}</ThemedText>
      {interval && <ThemedText style={styles.interval}>{interval}</ThemedText>}
    </AnimatedPressable>
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: '#ffffff',
  },
  interval: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
