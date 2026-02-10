import type { ColorKey } from '@/constants/theme';

export interface UseThemeColorProps {
  light?: string;
  dark?: string;
}

export type UseThemeColorColorName = ColorKey;

export type UseThemeColorReturn = string;
