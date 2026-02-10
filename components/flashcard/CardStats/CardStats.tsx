import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks';

import type { CardStatsProps } from '../FlashcardBack/FlashcardBack.type';

const TYPE_LABELS: Record<CardStatsProps['type'], string> = {
  new: 'New',
  learning: 'Learning',
  review: 'Review',
};

export function CardStats({ reviews, interval, ease, type }: CardStatsProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const stats = [
    { label: 'Reviews', value: String(reviews) },
    { label: 'Interval', value: interval },
    { label: 'Ease', value: `${ease}%` },
    { label: 'Type', value: TYPE_LABELS[type] },
  ];

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      <View style={styles.row}>
        {stats.map((stat, index) => (
          <View key={stat.label} style={styles.statItem}>
            {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            <View style={styles.statContent}>
              <ThemedText style={[styles.label, { color: colors.textMuted }]}>{stat.label}</ThemedText>
              <ThemedText style={[styles.value, { color: colors.textSecondary }]}>{stat.value}</ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingVertical: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 24,
  },
  statContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
  },
});
