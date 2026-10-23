import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';
import { type ThemeMode, useThemeMode } from '@/theme/theme-mode';

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light theme' },
  { value: 'dark', label: 'Dark theme' },
  { value: 'system', label: 'Match phone setting' },
];

function ModeIcon({ mode, color }: { mode: ThemeMode; color: string }) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      {mode === 'light' ? (
        <>
          <Circle cx={12} cy={12} r={4} />
          <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </>
      ) : mode === 'dark' ? (
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      ) : (
        <>
          <Circle cx={12} cy={12} r={9} />
          <Path d="M12 3a9 9 0 0 1 0 18z" fill={color} />
        </>
      )}
    </Svg>
  );
}

// Compact Light / Dark / System switch, small enough for a screen's top-right corner.
export function ThemeModeToggle() {
  const colors = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <View
      accessibilityRole="radiogroup"
      style={[styles.row, { backgroundColor: colors.backgroundSelected, borderColor: colors.border }]}>
      {OPTIONS.map((option) => {
        const selected = mode === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={option.label}
            onPress={() => setMode(option.value)}
            style={[styles.option, selected && { backgroundColor: colors.accent }]}>
            <ModeIcon
              mode={option.value}
              color={selected ? colors.onAccent : colors.textSecondary}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderRadius: 999, borderWidth: 1, padding: 4 },
  option: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
});