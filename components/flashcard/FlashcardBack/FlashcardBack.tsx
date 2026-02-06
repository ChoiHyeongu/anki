import { StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, FontFamily, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { FlashcardBackProps } from './FlashcardBack.type';

export function FlashcardBack({
  definition,
  examples,
  synonyms,
  highlightWord,
}: FlashcardBackProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const renderHighlightedExample = (text: string, index: number) => {
    if (!highlightWord) {
      return (
        <ThemedText style={[styles.exampleText, { color: colors.textMuted }]}>
          &ldquo;{text}&rdquo;
        </ThemedText>
      );
    }

    const regex = new RegExp(`(${highlightWord})`, 'gi');
    const parts = text.split(regex);

    return (
      <Text style={[styles.exampleText, { color: colors.textMuted }]}>
        &ldquo;
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Text key={i} style={[styles.highlightedWord, { color: colors.text }]}>
              {part}
            </Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
        &rdquo;
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {/* Meaning Section */}
      <View style={styles.section}>
        <ThemedText style={[styles.sectionLabel, { color: colors.textMuted }]}>
          Meaning
        </ThemedText>
        <ThemedText style={[styles.definition, { color: colors.textSecondary }]}>
          {definition}
        </ThemedText>
      </View>

      {/* Examples Section */}
      {examples && examples.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Examples
          </ThemedText>
          <View style={styles.examplesList}>
            {examples.map((example, index) => (
              <View
                key={index}
                style={[
                  styles.exampleItem,
                  {
                    borderLeftColor:
                      index === 0
                        ? `${colors.accent}4D` // 30% opacity
                        : colors.border,
                  },
                ]}
              >
                {renderHighlightedExample(example, index)}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Synonyms Section */}
      {synonyms && synonyms.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Synonyms
          </ThemedText>
          <View style={styles.synonymsRow}>
            {synonyms.map((synonym, index) => (
              <ThemedText
                key={index}
                style={[styles.synonymText, { color: colors.textMuted }]}
              >
                {synonym}
                {index < synonyms.length - 1 ? ',' : ''}
              </ThemedText>
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
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  section: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  definition: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.medium,
  },
  examplesList: {
    gap: 12,
    marginTop: 8,
  },
  exampleItem: {
    borderLeftWidth: 2,
    paddingLeft: 12,
  },
  exampleText: {
    fontSize: 15,
    fontFamily: FontFamily.regular,
    lineHeight: 22,
  },
  highlightedWord: {
    fontFamily: FontFamily.medium,
  },
  synonymsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  synonymText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
});
