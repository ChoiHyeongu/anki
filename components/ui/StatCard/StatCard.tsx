import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { StatCardProps } from './StatCard.type';

export function StatCard({ label, value, icon, valueColor }: StatCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <ThemedText
        style={[
          styles.value,
          valueColor ? { color: valueColor } : { color: colors.text },
        ]}
      >
        {value}
      </ThemedText>
      <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  iconContainer: {
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});
