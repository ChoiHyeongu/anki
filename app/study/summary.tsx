import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  // Mock stats - replace with actual session data
  const reviewCards = 38;
  const newCards = 12;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleGoHome = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.replace('/');
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
      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>오늘의 학습 완료!</ThemedText>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statRow}>
            <ThemedText style={[styles.statLabel, { color: colors.textMuted }]}>복습 카드:</ThemedText>
            <ThemedText style={[styles.statValue, { color: colors.accent }]}>{reviewCards}</ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={[styles.statLabel, { color: colors.textMuted }]}>신규 카드:</ThemedText>
            <ThemedText style={[styles.statValue, { color: colors.accent }]}>{newCards}</ThemedText>
          </View>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <AnimatedPressable
          onPress={handleGoHome}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.button, { backgroundColor: colors.accent }, animatedStyle]}
        >
          <ThemedText style={styles.buttonText}>홈으로 이동</ThemedText>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  titleSection: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  statsSection: {
    width: '100%',
    maxWidth: 240,
    gap: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 18,
    fontFamily: FontFamily.regular,
  },
  statValue: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 24,
  },
  button: {
    height: 58,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: '#0a0a0a',
  },
});
