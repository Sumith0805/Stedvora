export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const NAME_MAX_LENGTH = 50;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Emails are stored lower-case and without surrounding spaces. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function validateEmail(raw: string): string | null {
  const email = normalizeEmail(raw);
  if (!email) return 'Enter your email address.';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return 'Enter a valid email address.';
  return null;
}

/** Used when creating an account. */
export function validateNewPassword(password: string): string | null {
  if (!password) return 'Create a password.';
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Use at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  return null;
}

/** Used when logging in: only checks that something was typed. */
export function validateLoginPassword(password: string): string | null {
  return password ? null : 'Enter your password.';
}

export function validateDisplayName(raw: string): string | null {
  const name = raw.trim();
  if (!name) return 'Enter your name.';
  if (name.length > NAME_MAX_LENGTH) return `Use at most ${NAME_MAX_LENGTH} characters.`;
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return 'Re-enter your password.';
  if (password !== confirm) return 'Passwords do not match.';
  return null;
}
