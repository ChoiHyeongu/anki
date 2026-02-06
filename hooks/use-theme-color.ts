/**
 * Hook for accessing theme colors with automatic dark/light mode support.
 * Learn more: https://docs.expo.dev/guides/color-schemes/
 */

import { Colors, type ColorKey } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKey
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  return colorFromProps ?? Colors[theme][colorName];
}
