/**
 * Hook for accessing theme colors with automatic dark/light mode support.
 * Learn more: https://docs.expo.dev/guides/color-schemes/
 */

import { Colors, type ColorKey } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

import type { UseThemeColorProps, UseThemeColorReturn } from './useThemeColor.type';

export function useThemeColor(
  props: UseThemeColorProps,
  colorName: ColorKey
): UseThemeColorReturn {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  return colorFromProps ?? Colors[theme][colorName];
}
