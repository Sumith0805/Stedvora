import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ARC_LENGTH = 71; // each half of the S is a 270-degree arc of radius 15 (about 70.7 long)
const STROKE = 9;
const CAP_RADIUS = 4.5;
const MARK_SIZE = 120;

type Props = {
  topColor: string;
  bottomColor: string;
  wordColor: string;
  /** When true (phone has Reduce Motion on) everything appears at once. */
  reducedMotion: boolean;
};

// Draws the Stedvora "S" stroke by stroke, then fades in the name.
export function BrandIntro({ topColor, bottomColor, wordColor, reducedMotion }: Props) {
  const start = reducedMotion ? 1 : 0;
  const topDraw = useSharedValue(start);
  const topCap = useSharedValue(start);
  const bottomDraw = useSharedValue(start);
  const bottomCap = useSharedValue(start);
  const word = useSharedValue(start);

  useEffect(() => {
    if (reducedMotion) return;
    const ease = Easing.out(Easing.cubic);
    topCap.value = withDelay(250, withTiming(1, { duration: 180 }));
    topDraw.value = withDelay(250, withTiming(1, { duration: 650, easing: ease }));
    bottomDraw.value = withDelay(850, withTiming(1, { duration: 650, easing: ease }));
    bottomCap.value = withDelay(1450, withTiming(1, { duration: 180 }));
    word.value = withDelay(1100, withTiming(1, { duration: 600, easing: ease }));
  }, [reducedMotion, topCap, topDraw, bottomDraw, bottomCap, word]);

  const topProps = useAnimatedProps(() => ({ strokeDashoffset: ARC_LENGTH * (1 - topDraw.value) }));
  const bottomProps = useAnimatedProps(() => ({
    strokeDashoffset: ARC_LENGTH * (1 - bottomDraw.value),
  }));
  const topCapProps = useAnimatedProps(() => ({ r: CAP_RADIUS * topCap.value }));
  const bottomCapProps = useAnimatedProps(() => ({ r: CAP_RADIUS * bottomCap.value }));
  const wordStyle = useAnimatedStyle(() => ({
    opacity: word.value,
    letterSpacing: 14 - 6 * word.value,
  }));

  return (
    <>
      <View style={styles.mark}>
        <Svg width={MARK_SIZE} height={MARK_SIZE} viewBox="0 0 100 100">
          <G transform="translate(50 50) scale(1.2) translate(-50 -50)">
            <AnimatedPath
              d="M 65 35 A 15 15 0 1 0 50 50"
              stroke={topColor}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={[ARC_LENGTH, ARC_LENGTH]}
              animatedProps={topProps}
            />
            <AnimatedPath
              d="M 50 50 A 15 15 0 1 1 35 65"
              stroke={bottomColor}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={[ARC_LENGTH, ARC_LENGTH]}
              animatedProps={bottomProps}
            />
            <AnimatedCircle
              cx={65}
              cy={35}
              r={reducedMotion ? CAP_RADIUS : 0}
              fill={topColor}
              animatedProps={topCapProps}
            />
            <AnimatedCircle
              cx={35}
              cy={65}
              r={reducedMotion ? CAP_RADIUS : 0}
              fill={bottomColor}
              animatedProps={bottomCapProps}
            />
          </G>
        </Svg>
      </View>
      <Animated.Text style={[styles.wordmark, { color: wordColor }, wordStyle]}>
        STEDVORA
      </Animated.Text>
    </>
  );
}

const styles = StyleSheet.create({
  mark: { width: MARK_SIZE, height: MARK_SIZE },
  wordmark: {
    position: 'absolute',
    top: '50%',
    marginTop: MARK_SIZE / 2 + 28,
    fontSize: 20,
    fontWeight: '600',
  },
});