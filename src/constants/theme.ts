/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1C2128',
    background: '#F6F1E7',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EFE8DA',
    textSecondary: '#5B6470',
    border: '#DDD4C2',
    accent: '#0A7552',
    onAccent: '#FFFFFF',
    warning: '#8A5A08',
    danger: '#B3392B',
  },
  dark: {
    text: '#F6F1E7',
    background: '#0B1220',
    backgroundElement: '#121B2E',
    backgroundSelected: '#1A2540',
    textSecondary: '#9AA4B8',
    border: '#26324D',
    accent: '#2FBF8F',
    onAccent: '#0B1220',
    warning: '#E0A33A',
    danger: '#E26D5C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;