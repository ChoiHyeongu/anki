import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, FontFamily, SRSColors, Spacing } from '@/constants/theme';

import type { DeckStatsBadgeProps, DeckStatsType } from './DeckStatsBadge.type';

const BADGE_CONFIG: Record<DeckStatsType, { color: string; label: string }> = {
  new: { color: SRSColors.new, label: '새 카드' },
  learning: { color: SRSColors.learning, label: '학습 중' },
  review: { color: SRSColors.review, label: '복습' },
};

export function DeckStatsBadge({ type, count }: DeckStatsBadgeProps) {
  const config = BADGE_CONFIG[type];

  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <ThemedText style={styles.count}>{count}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    minWidth: 32,
    alignItems: 'center',
  },
  count: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: '#ffffff',
  },
});
