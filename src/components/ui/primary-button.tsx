import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function PrimaryButton({ label, onPress, loading = false, disabled = false, variant = 'primary' }: Props) {
  const colors = useTheme();
  const isPrimary = variant === 'primary';
  const inactive = disabled || loading;
  const textColor = isPrimary ? colors.onAccent : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? { backgroundColor: colors.accent }
          : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
        { opacity: inactive ? 0.6 : pressed ? 0.85 : 1 },
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: { fontSize: 16, fontWeight: '700' },
});
