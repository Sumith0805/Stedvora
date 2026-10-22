import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'stedvora.themeMode';

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

// 'system' means: stop overriding, follow the phone's setting.
function applyMode(mode: ThemeMode) {
  Appearance.setColorScheme(mode === 'system' ? null : mode);
}

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && (saved === 'light' || saved === 'dark' || saved === 'system')) {
          setModeState(saved);
          applyMode(saved);
        }
      } catch (error) {
        console.warn('Could not read saved theme; following the phone setting.', error);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    applyMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) =>
      console.warn('Could not save theme choice.', error)
    );
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside <ThemeModeProvider>.');
  return ctx;
}