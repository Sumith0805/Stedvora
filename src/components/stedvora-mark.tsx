import Svg, { Circle, G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

type Props = { size?: number };

// The Stedvora "S". The upper half follows the text colour, so it stays visible in both
// light and dark mode. The lower half uses the accent (emerald).
export function StedvoraMark({ size = 36 }: Props) {
  const colors = useTheme();

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      accessible
      accessibilityLabel="Stedvora logo">
      <G transform="translate(50 50) scale(1.2) translate(-50 -50)">
        <Path d="M 65 35 A 15 15 0 1 0 50 50" stroke={colors.text} strokeWidth={9} fill="none" />
        <Path d="M 50 50 A 15 15 0 1 1 35 65" stroke={colors.accent} strokeWidth={9} fill="none" />
        <Circle cx={65} cy={35} r={4.5} fill={colors.text} />
        <Circle cx={35} cy={65} r={4.5} fill={colors.accent} />
      </G>
    </Svg>
  );
}