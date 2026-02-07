import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeckList } from '@/components/deck';
import { ThemedText } from '@/components/themed-text';
import { Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { mockDecks } from '@/lib/mock-data';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const handleDeckPress = (deckId: string) => {
    router.push(`/study/${deckId}`);
  };

  const handleSyncPress = () => {
    // TODO: Implement sync
  };

  const handleSettingsPress = () => {
    // TODO: Navigate to settings
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>라이브러리</ThemedText>
        <View style={styles.headerActions}></View>
      </View>

      <DeckList decks={mockDecks} onDeckPress={handleDeckPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.medium,
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
  },
});
