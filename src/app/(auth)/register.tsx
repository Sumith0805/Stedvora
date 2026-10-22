import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, type TextInput, View } from 'react-native';

import { useAuth } from '@/auth/auth-provider';
import {
  PASSWORD_MIN_LENGTH,
  validateConfirmPassword,
  validateDisplayName,
  validateEmail,
  validateNewPassword,
} from '@/auth/validation';
import { AuthScreen } from '@/components/auth-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useTheme } from '@/hooks/use-theme';

type FieldErrors = {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  confirm?: string | null;
};

export default function RegisterScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (submitting) return;
    const nextErrors: FieldErrors = {
      name: validateDisplayName(name),
      email: validateEmail(email),
      password: validateNewPassword(password),
      confirm: validateConfirmPassword(password, confirm),
    };
    setErrors(nextErrors);
    setFormError(null);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    const result = await signUp(name, email, password);
    setSubmitting(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }
    // If email confirmation is off, the session starts and the app moves to Home by itself.
    if (result.needsEmailConfirmation) setConfirmationSent(true);
  };

  return (
    <AuthScreen
      title="Create your account"
      subtitle="Your workouts are saved to your account, so they follow you to any phone."
      footer={
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?
          </Text>
          <PrimaryButton variant="secondary" label="Log in" onPress={() => router.replace('/login')} />
        </View>
      }>
      {confirmationSent ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.notice, { color: colors.text, borderColor: colors.accent }]}>
          Account created. Check your email and tap the confirmation link, then come back and log in.
        </Text>
      ) : null}

      {formError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.notice, { color: colors.danger, borderColor: colors.danger }]}>
          {formError}
        </Text>
      ) : null}

      <TextField
        label="Name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        placeholder="What should we call you?"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextField
        label="Email"
        inputRef={emailRef}
        value={email}
        onChangeText={setEmail}
        error={errors.email}
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
        error={errors.password}
        placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
      />
      <TextField
        label="Confirm password"
        inputRef={confirmRef}
        value={confirm}
        onChangeText={setConfirm}
        error={errors.confirm}
        placeholder="Re-enter your password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <PrimaryButton label="Create account" onPress={handleSubmit} loading={submitting} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footer: { gap: 12 },
  footerText: { fontSize: 15 },
  notice: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
});
