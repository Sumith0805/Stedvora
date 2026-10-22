import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { type ThemeMode, useThemeMode } from '@/theme/theme-mode';

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function ThemeModeSwitcher() {
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
            accessibilityLabel={`${option.label} theme`}
            onPress={() => setMode(option.value)}
            style={[styles.option, selected && { backgroundColor: colors.accent }]}>
            <Text
              style={{
                fontWeight: '600',
                color: selected ? colors.onAccent : colors.textSecondary,
              }}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderRadius: 999, borderWidth: 1, padding: 4 },
  option: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
});