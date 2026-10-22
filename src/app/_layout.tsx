import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useTheme } from '@/hooks/use-theme'; // NEW
import { ThemeModeProvider } from '@/theme/theme-mode'; // NEW

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = useTheme(); // NEW
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  // NEW: navigation colours now come from the Stedvora palette
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.backgroundElement,
      text: colors.text,
      border: colors.border,
      primary: colors.accent,
    },
  };

  return (
    <ThemeModeProvider>
      <ThemeProvider value={navTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </ThemeModeProvider>
  );
}