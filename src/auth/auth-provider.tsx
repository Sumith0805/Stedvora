import type { Session } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { friendlyAuthError } from '@/auth/auth-errors';
import { normalizeEmail } from '@/auth/validation';
import { supabase } from '@/lib/supabase';

export type AuthResult = { error: string | null; needsEmailConfirmation?: boolean };

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (displayName: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.warn('Could not restore the saved session.', error.message);
        setSession(data.session ?? null);
      })
      .catch((error) => console.warn('Could not restore the saved session.', error))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    // Only update state here. Do not call other Supabase functions inside this callback.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizeEmail(email),
        password,
      });
      return { error: error ? friendlyAuthError(error) : null };
    } catch (error) {
      return { error: friendlyAuthError(error) };
    }
  }, []);

  const signUp = useCallback(
    async (displayName: string, email: string, password: string): Promise<AuthResult> => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: normalizeEmail(email),
          password,
          // The database trigger copies display_name into the user's profile row.
          options: { data: { display_name: displayName.trim() } },
        });
        if (error) return { error: friendlyAuthError(error) };
        // No session yet means the project requires email confirmation.
        return { error: null, needsEmailConfirmation: !data.session };
      } catch (error) {
        return { error: friendlyAuthError(error) };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      // If the server could not be reached, still clear the session on this phone.
      if (error) await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.warn('Sign-out failed.', error);
      await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    }
  }, []);

  const value = useMemo(
    () => ({ session, isLoading, signIn, signUp, signOut }),
    [session, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>.');
  return ctx;
}
