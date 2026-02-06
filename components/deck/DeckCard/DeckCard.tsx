import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors, FontFamily, SRSColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { DeckCardProps } from './DeckCard.type';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DeckCard({
  title,
  stats,
  detailedStats,
  progress,
  learningProgress = 0,
  isCompleted = false,
  onPress,
}: DeckCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  // Colors for stats based on whether they have values
  // Active: white/SRS colors, Inactive: dimmed (zinc-600)
  const reviewColor = stats.review > 0 ? colors.text : colors.textDimmed;
  const learningColor = stats.learning > 0 ? SRSColors.learning : colors.textDimmed;
  const newColor = stats.new > 0 ? SRSColors.new : colors.textDimmed;

  // Progress bar segments (learning on bottom, mature on top)
  const progressSegments = [
    {
      value: progress + learningProgress,
      color: SRSColors.learning,
      zIndex: 1,
    },
    {
      value: progress,
      color: SRSColors.review,
      zIndex: 2,
    },
  ];

  // Determine bottom row labels based on state
  const hasLearning = detailedStats.learning > 0;
  const hasNew = detailedStats.total - detailedStats.mature - detailedStats.learning > 0;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        animatedStyle,
        isCompleted && styles.completedContainer,
      ]}
    >
      {/* Header Row: Title + Stats */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: isCompleted ? colors.textMuted : colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {isCompleted && (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={SRSColors.review}
              style={styles.checkIcon}
            />
          )}
        </View>
        <View style={styles.statsRow}>
          <Text style={[styles.statNumber, { color: reviewColor }]}>
            {stats.review}
          </Text>
          <Text style={[styles.statNumber, { color: learningColor }]}>
            {stats.learning}
          </Text>
          <Text style={[styles.statNumber, { color: newColor }]}>
            {stats.new}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <ProgressBar
        segments={progressSegments}
        height={5}
        trackColor={colors.borderMuted}
      />

      {/* Bottom Row: Detailed Stats */}
      <View style={styles.bottomRow}>
        <View style={styles.detailStats}>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
            총 <Text style={[styles.detailValue, { color: colors.text }]}>{detailedStats.total}</Text>
          </Text>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
            익힘 <Text style={[styles.detailValue, { color: SRSColors.review }]}>{detailedStats.mature}</Text>
          </Text>
          {hasLearning && (
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
              진행 <Text style={[styles.detailValue, { color: SRSColors.learning }]}>{detailedStats.learning}</Text>
            </Text>
          )}
          {hasNew && !hasLearning && (
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
              미시작 <Text style={[styles.detailValue, { color: SRSColors.new }]}>{detailedStats.total - detailedStats.mature}</Text>
            </Text>
          )}
        </View>
        <Text style={[styles.progressPercent, { color: colors.textMuted }]}>
          {progress.toFixed(1)}%
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  completedContainer: {
    opacity: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontFamily: FontFamily.medium,
    letterSpacing: -0.3,
  },
  checkIcon: {
    marginLeft: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statNumber: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    minWidth: 20,
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    letterSpacing: -0.2,
  },
  detailValue: {
    fontFamily: FontFamily.medium,
  },
  progressPercent: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
  },
});
