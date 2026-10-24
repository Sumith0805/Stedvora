import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#141414',
    background: '#F5F5F1',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EAEAE5',
    textSecondary: '#5C5C5C',
    border: '#DCDCD6',
    accent: '#E50914',
    onAccent: '#FFFFFF',
    accentText: '#B20710',
    warning: '#8A5A08',
    danger: '#B54708',
  },
  dark: {
    text: '#FFFFFF',
    background: '#141414',
    backgroundElement: '#1F1F1F',
    backgroundSelected: '#2B2B2B',
    textSecondary: '#B3B3B3',
    border: '#333333',
    accent: '#E50914',
    onAccent: '#FFFFFF',
    accentText: '#FF5A5F',
    warning: '#F5A524',
    danger: '#FF9B6B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;