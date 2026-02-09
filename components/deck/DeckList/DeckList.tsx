import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { DeckCard } from '../DeckCard';

import type { Deck, DeckListProps } from './DeckList.type';

export function DeckList({ decks, onDeckPress, refreshing, onRefresh }: DeckListProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const renderDeck = ({ item }: { item: Deck }) => (
    <DeckCard
      title={item.title}
      stats={item.stats}
      detailedStats={item.detailedStats}
      progress={item.progress}
      learningProgress={item.learningProgress}
      isCompleted={item.isCompleted}
      onPress={() => onDeckPress?.(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: colors.textMuted }]}>덱이 없습니다</ThemedText>
    </View>
  );

  return (
    <FlatList
      data={decks}
      keyExtractor={(item) => item.id}
      renderItem={renderDeck}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing ?? false}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl * 2,
    flexGrow: 1,
    rowGap: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
  },
});
