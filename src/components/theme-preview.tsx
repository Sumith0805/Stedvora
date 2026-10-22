import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ThemeModeSwitcher } from '@/components/theme-mode-switcher';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ThemePreview() {
  const colors = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}>
      <Text style={[styles.display, { color: colors.text }]}>Stedvora</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        Theme preview. All numbers below are sample data.
      </Text>

      <View
        style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Text style={[styles.caption, { color: colors.textSecondary }]}>
          BARBELL BENCH PRESS · SET 1
        </Text>
        <Text style={[styles.display, { color: colors.text }]}>80 kg × 8</Text>
        <Text style={[styles.caption, { color: colors.warning }]}>Warning colour sample</Text>
        <Text style={[styles.caption, { color: colors.danger }]}>Error colour sample</Text>
        <Text style={[styles.caption, { color: colors.textSecondary }]}>Sample data</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        style={[styles.button, { backgroundColor: colors.accent }]}>
        <Text style={{ color: colors.onAccent, fontWeight: '700', fontSize: 16 }}>Complete set</Text>
      </Pressable>

      <ThemeModeSwitcher />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24 },
  caption: { fontSize: 13, lineHeight: 18 },
  card: { borderRadius: 20, borderWidth: 1, padding: Spacing.four, gap: Spacing.one },
  button: { minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});