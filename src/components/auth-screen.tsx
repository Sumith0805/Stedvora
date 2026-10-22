import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeModeSwitcher } from '@/components/theme-mode-switcher';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreen({ title, subtitle, children, footer }: Props) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.five, paddingBottom: insets.bottom + Spacing.four },
        ]}>
        <View style={styles.column}>
          <View style={styles.brand}>
            <Image
              source={require('@/assets/images/stedvora-mark.png')}
              contentFit="contain"
              style={styles.mark}
            />
            <Text style={[styles.brandName, { color: colors.text }]}>STEDVORA</Text>
          </View>

          <View style={styles.heading}>
            <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          </View>

          <View style={styles.form}>{children}</View>

          {footer}

          <View style={styles.switcher}>
            <Text style={[styles.switcherLabel, { color: colors.textSecondary }]}>Appearance</Text>
            <ThemeModeSwitcher />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: Spacing.four },
  column: { width: '100%', maxWidth: 480, alignSelf: 'center', gap: Spacing.four },
  brand: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  mark: { width: 36, height: 36 },
  brandName: { fontSize: 15, fontWeight: '700', letterSpacing: 4 },
  heading: { gap: Spacing.two },
  title: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
  subtitle: { fontSize: 16, lineHeight: 24 },
  form: { gap: Spacing.three },
  switcher: { gap: Spacing.two, marginTop: Spacing.three },
  switcherLabel: { fontSize: 13, fontWeight: '600' },
});
