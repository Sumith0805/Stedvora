type ErrorLike = { message?: string; name?: string; status?: number };

const FALLBACK = 'Something went wrong. Please try again.';

/** Turns Supabase/network errors into short messages that are safe to show to a user. */
export function friendlyAuthError(error: unknown): string {
  if (!error || typeof error !== 'object') return FALLBACK;
  const { message = '', name = '', status } = error as ErrorLike;

  if (
    name === 'AuthRetryableFetchError' ||
    /network request failed|failed to fetch|timed out|network error/i.test(message)
  ) {
    return "Can't reach the server. Check your internet connection and try again.";
  }
  if (status === 429 || /rate limit|too many/i.test(message)) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  if (/invalid login credentials/i.test(message)) {
    return 'Email or password is incorrect.';
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email first, then log in.';
  }
  if (/already (been )?registered|user already exists/i.test(message)) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (/password/i.test(message) && /(weak|short|at least|characters)/i.test(message)) {
    return 'Choose a stronger password.';
  }
  return FALLBACK;
}
