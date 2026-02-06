import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/IconButton';
import { Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { FlashcardFrontProps } from './FlashcardFront.type';

export function FlashcardFront({
  word,
  phonetic,
  onAudioPress,
}: FlashcardFrontProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.word}>{word}</ThemedText>

      {phonetic && (
        <View style={styles.phoneticRow}>
          <ThemedText style={[styles.phonetic, { color: colors.textMuted }]}>
            {phonetic}
          </ThemedText>
          {onAudioPress && (
            <IconButton
              icon={
                <Ionicons name="volume-medium" size={24} color={colors.accent} />
              }
              onPress={onAudioPress}
              size={36}
              accessibilityLabel="발음 듣기"
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  word: {
    fontSize: 36,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  phonetic: {
    fontSize: 18,
    fontFamily: FontFamily.regular,
  },
});
