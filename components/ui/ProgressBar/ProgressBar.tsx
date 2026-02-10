import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks';

import type { ProgressBarProps, ProgressSegment } from './ProgressBar.type';

function ProgressSegmentView({
  segment,
  trackWidth,
  animated = true,
}: {
  segment: ProgressSegment;
  trackWidth: SharedValue<number>;
  animated?: boolean;
}) {
  const clampedProgress = Math.min(100, Math.max(0, segment.value));

  const animatedStyle = useAnimatedStyle(() => {
    const targetWidth = (clampedProgress / 100) * trackWidth.value;
    const width = animated
      ? withTiming(targetWidth, {
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      : targetWidth;

    return {
      width,
    };
  }, [clampedProgress, animated]);

  return (
    <Animated.View
      style={[
        styles.segment,
        {
          backgroundColor: segment.color,
          zIndex: segment.zIndex ?? 1,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ProgressBar({
  progress,
  segments,
  height = 5,
  trackColor,
  fillColor,
  animated = true,
}: ProgressBarProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const trackWidth = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  // Single progress mode (backward compatible)
  const clampedProgress = progress !== undefined ? Math.min(100, Math.max(0, progress)) : 0;

  const singleAnimatedStyle = useAnimatedStyle(() => {
    const targetWidth = (clampedProgress / 100) * trackWidth.value;
    const width = animated
      ? withTiming(targetWidth, {
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      : targetWidth;

    return {
      width,
    };
  }, [clampedProgress, animated]);

  // Sort segments by zIndex (lower first, so higher zIndex renders on top)
  const sortedSegments = segments
    ? [...segments].sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1))
    : null;

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor ?? colors.borderMuted,
        },
      ]}
    >
      {sortedSegments ? (
        // Multi-segment mode
        sortedSegments.map((segment, index) => (
          <ProgressSegmentView
            key={index}
            segment={segment}
            trackWidth={trackWidth}
            animated={animated}
          />
        ))
      ) : (
        // Single segment mode (backward compatible)
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: fillColor ?? colors.accent,
            },
            singleAnimatedStyle,
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  segment: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
