import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { StatCard } from '@/components/ui/StatCard';
import { BorderRadius, Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { SessionSummaryCardProps } from './SessionSummaryCard.type';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}

function ActionButton({ label, onPress, variant }: ActionButtonProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const isPrimary = variant === 'primary';

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.actionButton,
        animatedStyle,
        {
          backgroundColor: isPrimary ? colors.accent : colors.surface,
          borderWidth: isPrimary ? 0 : 1,
          borderColor: colors.border,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.actionButtonText,
          { color: isPrimary ? '#0a0a0a' : colors.text },
        ]}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function SessionSummaryCard({
  stats,
  onContinue,
  onGoHome,
}: SessionSummaryCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const accuracy =
    stats.studied > 0
      ? Math.round((stats.correct / stats.studied) * 100)
      : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ThemedText style={styles.title}>학습 완료!</ThemedText>

      <View style={styles.statsGrid}>
        <StatCard label="학습한 카드" value={stats.studied} />
        <StatCard
          label="정확도"
          value={`${accuracy}%`}
          valueColor={colors.success}
        />
        <StatCard label="소요 시간" value={formatTime(stats.timeSpent)} />
        <StatCard
          label="새로 학습"
          value={stats.newLearned}
          valueColor={colors.accent}
        />
      </View>

      <View style={styles.actions}>
        {onContinue && (
          <ActionButton
            label="계속 학습"
            onPress={onContinue}
            variant="primary"
          />
        )}
        <ActionButton
          label="홈으로"
          onPress={onGoHome}
          variant={onContinue ? 'secondary' : 'primary'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  actions: {
    gap: Spacing.sm,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
  },
});
