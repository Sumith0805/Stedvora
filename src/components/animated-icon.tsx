import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';

const BRAND_NAVY = '#0B1220';
const BRAND_IVORY = '#F6F1E7';
const HOLD_MS = 1400; // how long the brand screen stays visible
const HOLD_MS_REDUCED = 700; // shorter when the phone has "Reduce Motion" on
const FADE_MS = 450;
const MARK_SIZE = 120;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();
  const started = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Once our navy screen is on screen, hide the native splash, hold briefly, then fade out.
  const handleLayout = useCallback(() => {
    if (started.current) return;
    started.current = true;
    SplashScreen.hideAsync()
      .catch(() => {})
      .finally(() => {
        timer.current = setTimeout(
          () => setVisible(false),
          reducedMotion ? HOLD_MS_REDUCED : HOLD_MS
        );
      });
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <Animated.View
      exiting={FadeOut.duration(FADE_MS)}
      onLayout={handleLayout}
      accessible
      accessibilityLabel="Stedvora is loading"
      style={styles.overlay}>
      <Animated.View entering={FadeIn.duration(600)}>
        <Image
          style={styles.mark}
          contentFit="contain"
          source={require('@/assets/images/stedvora-mark.png')}
        />
      </Animated.View>
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.wordmark}>
        STEDVORA
      </Animated.Text>
    </Animated.View>
  );
}

// Kept so any other file that imports it still compiles.
export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Image
        style={styles.mark}
        contentFit="contain"
        source={require('@/assets/images/stedvora-mark.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: BRAND_NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  mark: { width: MARK_SIZE, height: MARK_SIZE },
  wordmark: {
    position: 'absolute',
    top: '50%',
    marginTop: MARK_SIZE / 2 + 28,
    color: BRAND_IVORY,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
});