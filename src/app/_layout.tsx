import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AuthProvider, useAuth } from '@/auth/auth-provider';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useTheme } from '@/hooks/use-theme';
import { ThemeModeProvider } from '@/theme/theme-mode';

SplashScreen.preventAutoHideAsync();

// Logged-in users see the app; logged-out users see the login screens.
function RootNavigator() {
  const { session, isLoading } = useAuth();

  // The animated Stedvora screen covers the app while the saved session is checked.
  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = useTheme();
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

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
      <AuthProvider>
        <ThemeProvider value={navTheme}>
          <AnimatedSplashOverlay />
          <RootNavigator />
        </ThemeProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}
