import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { FlashcardBackProps } from './FlashcardBack.type';

export function FlashcardBack({
  definition,
  example,
  synonyms,
}: FlashcardBackProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.definition}>{definition}</ThemedText>

      {example && (
        <View
          style={[styles.exampleContainer, { backgroundColor: colors.cardBack }]}
        >
          <ThemedText style={[styles.exampleLabel, { color: colors.textMuted }]}>
            예문
          </ThemedText>
          <ThemedText style={[styles.example, { color: colors.textSecondary }]}>
            &ldquo;{example}&rdquo;
          </ThemedText>
        </View>
      )}

      {synonyms && synonyms.length > 0 && (
        <View style={styles.synonymsContainer}>
          <ThemedText style={[styles.synonymsLabel, { color: colors.textMuted }]}>
            유의어
          </ThemedText>
          <View style={styles.synonymsList}>
            {synonyms.map((synonym, index) => (
              <View
                key={index}
                style={[styles.synonymTag, { backgroundColor: colors.border }]}
              >
                <ThemedText
                  style={[styles.synonymText, { color: colors.textSecondary }]}
                >
                  {synonym}
                </ThemedText>
              </View>
            ))}
          </View>
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
    gap: Spacing.lg,
  },
  definition: {
    fontSize: 24,
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
  },
  exampleContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
  },
  exampleLabel: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    marginBottom: Spacing.xs,
  },
  example: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    fontStyle: 'italic',
  },
  synonymsContainer: {
    width: '100%',
  },
  synonymsLabel: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    marginBottom: Spacing.sm,
  },
  synonymsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  synonymTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  synonymText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});
