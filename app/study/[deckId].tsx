import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Flashcard } from '@/components/flashcard';
import { RatingButtons, RevealButton, StudyHeader } from '@/components/study';
import type { Rating } from '@/components/study/RatingButtons';
import { BorderRadius, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { mockCards } from '@/lib/mock-data';

export default function StudyScreen() {
  const { deckId: _deckId } = useLocalSearchParams<{ deckId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const currentCard = mockCards[currentIndex];
  const totalCards = mockCards.length;

  const handleClose = () => {
    router.back();
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousIndex = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentIndex(previousIndex);
      setIsRevealed(false);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleRate = (rating: Rating) => {
    setHistory((prev) => [...prev, currentIndex]);

    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      router.replace('/study/summary');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StudyHeader
        current={currentIndex + 1}
        total={totalCards}
        onClose={handleClose}
        onUndo={handleUndo}
        canUndo={history.length > 0}
      />

      <Flashcard
        front={currentCard.front}
        back={currentCard.back}
        stats={currentCard.stats}
        isRevealed={isRevealed}
        onReveal={handleReveal}
      />

      {isRevealed ? (
        <>
          <RatingButtons
            onRate={handleRate}
            intervals={{
              again: '1m',
              hard: '2d',
              good: '4d',
              easy: '7d',
            }}
          />
          <View
            style={[styles.homeIndicator, { backgroundColor: colors.border }]}
          />
        </>
      ) : (
        <RevealButton />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeIndicator: {
    width: 128,
    height: 6,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginBottom: 8,
    opacity: 0.5,
  },
});
