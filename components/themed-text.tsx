import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontFamily, FontSize } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const linkColor = useThemeColor({}, 'accent');

  return (
    <Text
      style={[
        { color: type === 'link' ? linkColor : color },
        styles.base,
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FontFamily.regular,
  },
  default: {
    fontSize: FontSize.base,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: FontSize.base,
    lineHeight: 24,
    fontFamily: FontFamily.semiBold,
  },
  title: {
    fontSize: FontSize['4xl'],
    fontFamily: FontFamily.bold,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
  },
  link: {
    lineHeight: 30,
    fontSize: FontSize.base,
    // color is set dynamically via useThemeColor
  },
});
