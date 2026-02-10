import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Rating } from '@/components/study/RatingButtons/RatingButtons.type';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, FontFamily, RatingColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const RATING_LABELS: Record<Rating, string> = {
  again: '다시',
  hard: '어려움',
  good: '알맞음',
  easy: '쉬움',
};

const RATINGS_ORDER: Rating[] = ['again', 'hard', 'good', 'easy'];

interface RatingBreakdownRowProps {
  rating: Rating;
  count: number;
  percentage: number;
  color: string;
}

function RatingBreakdownRow({ rating, count, percentage, color }: RatingBreakdownRowProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.ratingRow}>
      {/* Rating label with dot */}
      <View style={styles.ratingLabelContainer}>
        <View style={[styles.ratingDot, { backgroundColor: color }]} />
        <ThemedText style={[styles.ratingLabel, { color: colors.textSecondary }]}>{RATING_LABELS[rating]}</ThemedText>
      </View>

      {/* Word count */}
      <View style={styles.wordCountContainer}>
        <ThemedText style={styles.wordCount}>{count}</ThemedText>
        <ThemedText style={[styles.wordUnit, { color: colors.textMuted }]}>WORDS</ThemedText>
      </View>

      {/* Progress bar row */}
      <View style={styles.progressRow}>
        <View style={[styles.progressTrack, { backgroundColor: colors.borderMuted }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: color,
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
        <ThemedText style={[styles.percentageText, { color: colors.textMuted }]}>{percentage}%</ThemedText>
      </View>
    </View>
  );
}

interface OverallProgressBarProps {
  counts: Record<Rating, number>;
  total: number;
}

function OverallProgressBar({ counts, total }: OverallProgressBarProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  if (total === 0) {
    return <View style={[styles.overallBar, { backgroundColor: colors.borderMuted }]} />;
  }

  return (
    <View style={[styles.overallBar, { backgroundColor: colors.borderMuted }]}>
      {RATINGS_ORDER.map((rating) => {
        const percentage = (counts[rating] / total) * 100;
        if (percentage === 0) return null;
        return (
          <View
            key={rating}
            style={[
              styles.overallSegment,
              {
                backgroundColor: RatingColors[rating],
                width: `${percentage}%`,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export default function SummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    againCount?: string;
    hardCount?: string;
    goodCount?: string;
    easyCount?: string;
  }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  // Parse rating counts from route params
  const counts: Record<Rating, number> = {
    again: parseInt(params.againCount ?? '0', 10),
    hard: parseInt(params.hardCount ?? '0', 10),
    good: parseInt(params.goodCount ?? '0', 10),
    easy: parseInt(params.easyCount ?? '0', 10),
  };

  const total = counts.again + counts.hard + counts.good + counts.easy;

  // Calculate percentages (avoid division by zero)
  const getPercentage = (count: number): number => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleGoHome = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.replace('/');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Content Section */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>Performance Breakdown</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>Detailed Session Analysis</ThemedText>
        </View>

        {/* Overall Progress Bar */}
        <View style={styles.overallContainer}>
          <OverallProgressBar counts={counts} total={total} />
        </View>

        {/* Rating Breakdown */}
        <View style={styles.breakdownContainer}>
          {RATINGS_ORDER.map((rating) => (
            <RatingBreakdownRow
              key={rating}
              rating={rating}
              count={counts[rating]}
              percentage={getPercentage(counts[rating])}
              color={RatingColors[rating]}
            />
          ))}
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <AnimatedPressable
          onPress={handleGoHome}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.button, animatedStyle]}
        >
          <ThemedText style={[styles.buttonText, { color: colors.text }]}>RETURN HOME</ThemedText>
          <View style={[styles.buttonUnderline, { backgroundColor: colors.accent }]} />
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 26,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    marginTop: 4,
  },
  overallContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 56,
  },
  overallBar: {
    height: 10,
    width: '100%',
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  overallSegment: {
    height: '100%',
  },
  breakdownContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 28,
  },
  ratingRow: {
    gap: 8,
  },
  ratingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginRight: 12,
  },
  ratingLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
  },
  wordCountContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  wordCount: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
  },
  wordUnit: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  percentageText: {
    width: 32,
    fontSize: 11,
    fontFamily: FontFamily.bold,
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 12,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    letterSpacing: 2.5,
  },
  buttonUnderline: {
    height: 2,
    width: 48,
    marginTop: 12,
    borderRadius: BorderRadius.full,
  },
});
