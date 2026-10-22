import { type Ref, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
  inputRef?: Ref<TextInput>;
};

export function TextField({ label, error, inputRef, secureTextEntry, ...inputProps }: Props) {
  const colors = useTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isPassword = !!secureTextEntry;

  const borderColor = error ? colors.danger : focused ? colors.accent : colors.border;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.inputRow, { backgroundColor: colors.backgroundElement, borderColor }]}>
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && !revealed}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, { color: colors.text }]}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            onPress={() => setRevealed((value) => !value)}
            hitSlop={8}
            style={styles.toggle}>
            <Text style={{ color: colors.accent, fontWeight: '600' }}>{revealed ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 12 },
  toggle: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  error: { fontSize: 13 },
});
