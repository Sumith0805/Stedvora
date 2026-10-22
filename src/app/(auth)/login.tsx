import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, type TextInput, View } from 'react-native';

import { useAuth } from '@/auth/auth-provider';
import { validateEmail, validateLoginPassword } from '@/auth/validation';
import { AuthScreen } from '@/components/auth-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (submitting) return;
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validateLoginPassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(null);
    if (nextEmailError || nextPasswordError) return;

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    // On success the session changes and the app moves to Home by itself.
    if (result.error) setFormError(result.error);
  };

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Log in to see your workouts on any device."
      footer={
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>New to Stedvora?</Text>
          <PrimaryButton
            variant="secondary"
            label="Create an account"
            onPress={() => router.push('/register')}
          />
        </View>
      }>
      {formError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.formError, { color: colors.danger, borderColor: colors.danger }]}>
          {formError}
        </Text>
      ) : null}

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        placeholder="you@example.com"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        label="Password"
        inputRef={passwordRef}
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        placeholder="Your password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <PrimaryButton label="Log in" onPress={handleSubmit} loading={submitting} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footer: { gap: 12 },
  footerText: { fontSize: 15 },
  formError: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
});
