/**
 * Custom Navigation Themes for React Navigation v7
 * Based on Stitch Design System
 */

import { Theme } from '@react-navigation/native';
import { Platform } from 'react-native';
import { Colors, FontFamily } from './theme';

// React Navigation v7 requires fonts configuration
const fonts = Platform.select({
  ios: {
    regular: { fontFamily: FontFamily.regular, fontWeight: '400' as const },
    medium: { fontFamily: FontFamily.medium, fontWeight: '500' as const },
    bold: { fontFamily: FontFamily.semiBold, fontWeight: '600' as const },
    heavy: { fontFamily: FontFamily.bold, fontWeight: '700' as const },
  },
  default: {
    regular: { fontFamily: FontFamily.regular, fontWeight: 'normal' as const },
    medium: { fontFamily: FontFamily.medium, fontWeight: 'normal' as const },
    bold: { fontFamily: FontFamily.semiBold, fontWeight: '600' as const },
    heavy: { fontFamily: FontFamily.bold, fontWeight: '700' as const },
  },
})!;

export const AnkiDarkTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.dark.accent,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.accent,
  },
  fonts,
};

export const AnkiLightTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.light.accent,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.accent,
  },
  fonts,
};
