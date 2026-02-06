import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { RevealButtonProps } from './RevealButton.type';

export function RevealButton({ disabled = false }: RevealButtonProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}>
      <ThemedText style={[styles.hint, { color: colors.borderMuted }]}>
        Tap to reveal answer
      </ThemedText>
      <View style={[styles.homeIndicator, { backgroundColor: colors.borderMuted }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: 48,
    height: 128,
    justifyContent: 'flex-end',
  },
  hint: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 32,
  },
  homeIndicator: {
    width: 128,
    height: 6,
    borderRadius: BorderRadius.full,
    opacity: 0.5,
  },
});
