import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { StudyHeaderProps } from './StudyHeader.type';

export function StudyHeader({
  current,
  total,
  onClose,
  onUndo,
  canUndo,
}: StudyHeaderProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <IconButton
          icon={<Ionicons name="close" size={24} color={colors.icon} />}
          onPress={onClose}
          accessibilityLabel="학습 종료"
        />

        <ThemedText style={styles.counter}>
          {current} / {total}
        </ThemedText>

        <IconButton
          icon={
            <Ionicons
              name="arrow-undo"
              size={24}
              color={canUndo ? colors.icon : colors.iconMuted}
            />
          }
          onPress={onUndo}
          disabled={!canUndo}
          accessibilityLabel="이전 카드로 돌아가기"
        />
      </View>

      <ProgressBar progress={progress} height={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
  },
});
