import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { FlashcardBack } from '../FlashcardBack';
import { FlashcardFront } from '../FlashcardFront';

import type { FlashcardProps } from './Flashcard.type';

const ANIMATION_DURATION = 200;

export function Flashcard({
  front,
  back,
  isRevealed,
  onReveal,
}: FlashcardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isRevealed ? 0 : 1, {
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.ease),
    }),
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isRevealed ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.ease),
    }),
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }));

  return (
    <Pressable
      onPress={onReveal}
      style={[styles.container, { backgroundColor: colors.cardFront }]}
    >
      <View style={styles.cardContent}>
        <Animated.View style={frontAnimatedStyle}>
          <FlashcardFront
            word={front.word}
            phonetic={front.phonetic}
            onAudioPress={front.onAudioPress}
          />
        </Animated.View>

        <Animated.View style={backAnimatedStyle}>
          <FlashcardBack
            definition={back.definition}
            example={back.example}
            synonyms={back.synonyms}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    margin: Spacing.md,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    position: 'relative',
  },
});
