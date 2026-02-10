import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors, FontFamily, SRSColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks';

import type { DeckCardProps } from './DeckCard.type';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Format timestamp to yyyy.mm.dd hh:mm:ss
 */
function formatDueDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${month}.${day} ${hours}:${minutes}:${seconds}`;
}

export function DeckCard({
  title,
  stats,
  detailedStats,
  progress,
  youngProgress = 0,
  learningProgress = 0,
  nextDueDate,
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
  // Active: SRS colors, Inactive: dimmed (zinc-600)
  const reviewColor = stats.review > 0 ? SRSColors.mature : colors.textDimmed;
  const youngColor = stats.young > 0 ? SRSColors.young : colors.textDimmed;
  const learningColor = stats.learning > 0 ? SRSColors.learning : colors.textDimmed;
  const newColor = stats.new > 0 ? SRSColors.new : colors.textDimmed;

  // Progress bar segments (learning on bottom, young in middle, mature on top)
  const progressSegments = [
    {
      value: progress + youngProgress + learningProgress,
      color: SRSColors.learning,
      zIndex: 1,
    },
    {
      value: progress + youngProgress,
      color: SRSColors.young,
      zIndex: 2,
    },
    {
      value: progress,
      color: SRSColors.mature,
      zIndex: 3,
    },
  ];

  // Determine bottom row labels based on state
  const hasYoung = detailedStats.young > 0;
  const hasLearning = detailedStats.learning > 0;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle, isCompleted && styles.completedContainer]}
    >
      {/* Header Row: Title + Stats */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, { color: isCompleted ? colors.textMuted : colors.textSecondary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {isCompleted && (
            <Ionicons name='checkmark-circle' size={18} color={SRSColors.review} style={styles.checkIcon} />
          )}
        </View>
        <View style={styles.statsRow}>
          <Text style={[styles.statNumber, { color: reviewColor }]}>{stats.review}</Text>
          <Text style={[styles.statNumber, { color: youngColor }]}>{stats.young}</Text>
          <Text style={[styles.statNumber, { color: learningColor }]}>{stats.learning}</Text>
          <Text style={[styles.statNumber, { color: newColor }]}>{stats.new}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <ProgressBar segments={progressSegments} height={5} trackColor={colors.borderMuted} />

      {/* Bottom Row: Detailed Stats */}
      <View style={styles.bottomRow}>
        <View style={styles.detailStats}>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
            총 <Text style={[styles.detailValue, { color: colors.text }]}>{detailedStats.total}</Text>
          </Text>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
            숙성{' '}
            <Text style={[styles.detailValue, { color: hasYoung ? SRSColors.young : colors.textDimmed }]}>
              {detailedStats.young}
            </Text>
          </Text>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
            익힘{' '}
            <Text
              style={[styles.detailValue, { color: detailedStats.mature > 0 ? SRSColors.mature : colors.textDimmed }]}
            >
              {detailedStats.mature}
            </Text>
          </Text>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
            진행{' '}
            <Text style={[styles.detailValue, { color: hasLearning ? SRSColors.learning : colors.textDimmed }]}>
              {detailedStats.learning}
            </Text>
          </Text>
        </View>
        <Text style={[styles.progressPercent, { color: colors.textMuted }]}>{progress.toFixed(1)}%</Text>
      </View>

      {/* Next Due Time */}
      {nextDueDate && (
        <Text style={[styles.nextDueTime, { color: colors.textMuted }]}>다음: {formatDueDate(nextDueDate)}</Text>
      )}
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
    gap: Spacing.sm,
  },
  statNumber: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    minWidth: 18,
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
  nextDueTime: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    letterSpacing: -0.2,
  },
});
