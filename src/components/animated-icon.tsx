import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import Animated, { FadeOut, useReducedMotion } from 'react-native-reanimated';

import { BrandIntro } from '@/components/brand-intro';
import { StedvoraMark } from '@/components/stedvora-mark';

// The intro always uses the dark brand look, whatever theme the app is in.
const INTRO_BACKGROUND = '#000000';
const INTRO_WHITE = '#FFFFFF';
const BRAND_RED = '#E50914';

const HOLD_MS = 2300; // how long the intro plays before fading out
const HOLD_MS_REDUCED = 700; // shorter when the phone has "Reduce Motion" on
const FADE_MS = 450;
// If the app was in the background for at least this long, the intro plays again on return.
const REPLAY_AFTER_MS = 30_000;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const [runKey, setRunKey] = useState(0);
  const reducedMotion = useReducedMotion();
  const nativeSplashHidden = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leftAt = useRef<number | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(
      () => setVisible(false),
      reducedMotion ? HOLD_MS_REDUCED : HOLD_MS
    );
  }, [reducedMotion]);

  // Replay the intro when the app is reopened after being away for a while.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        leftAt.current = Date.now();
      } else if (state === 'active') {
        const away = leftAt.current ? Date.now() - leftAt.current : 0;
        leftAt.current = null;
        if (away >= REPLAY_AFTER_MS) {
          setRunKey((key) => key + 1);
          setVisible(true);
          scheduleHide();
        }
      }
    });
    return () => {
      subscription.remove();
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [scheduleHide]);

  // First launch: once our black screen is showing, hide the native splash and start the clock.
  const handleLayout = useCallback(() => {
    if (nativeSplashHidden.current) return;
    nativeSplashHidden.current = true;
    SplashScreen.hideAsync()
      .catch(() => {})
      .finally(scheduleHide);
  }, [scheduleHide]);

  if (!visible) return null;

  return (
    <Animated.View
      key={runKey}
      exiting={FadeOut.duration(FADE_MS)}
      onLayout={handleLayout}
      accessible
      accessibilityLabel="Stedvora is loading"
      style={styles.overlay}>
      <BrandIntro
        topColor={INTRO_WHITE}
        bottomColor={BRAND_RED}
        wordColor={INTRO_WHITE}
        reducedMotion={reducedMotion}
      />
    </Animated.View>
  );
}

// Kept so any other file that imports it still compiles.
export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <StedvoraMark size={120} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: INTRO_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
});