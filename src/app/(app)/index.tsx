import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/auth-provider';
import { ThemeModeSwitcher } from '@/components/theme-mode-switcher';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

type Profile = { display_name: string; weight_unit: string };
type LoadState = 'loading' | 'ready' | 'error';

export default function HomeScreen() {
  const colors = useTheme();
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [signingOut, setSigningOut] = useState(false);

  const loadProfile = useCallback(async () => {
    setState('loading');
    // Row Level Security returns only the logged-in user's own row.
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, weight_unit')
      .single();
    if (error || !data) {
      setState('error');
      return;
    }
    setProfile(data as Profile);
    setState('ready');
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        {state === 'ready' && profile ? `Hi, ${profile.display_name}` : 'Stedvora'}
      </Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        Temporary home screen. Your workout screens are built next.
      </Text>

      <View
        style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Text style={[styles.caption, { color: colors.textSecondary }]}>ACCOUNT</Text>
        <Text style={[styles.value, { color: colors.text }]}>{session?.user.email ?? ''}</Text>

        {state === 'loading' ? (
          <Text style={[styles.body, { color: colors.textSecondary }]}>Loading your profile…</Text>
        ) : null}

        {state === 'ready' && profile ? (
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Profile loaded from your cloud database. Weight unit: {profile.weight_unit}.
          </Text>
        ) : null}

        {state === 'error' ? (
          <View style={styles.errorBlock}>
            <Text style={[styles.body, { color: colors.danger }]}>
              Could not load your profile. Check your connection and try again.
            </Text>
            <PrimaryButton variant="secondary" label="Try again" onPress={loadProfile} />
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={[styles.caption, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <ThemeModeSwitcher />
      </View>

      <PrimaryButton
        variant="secondary"
        label="Log out"
        onPress={handleSignOut}
        loading={signingOut}
      />
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
  title: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '600', letterSpacing: 1 },
  value: { fontSize: 18, fontWeight: '600' },
  card: { borderRadius: 20, borderWidth: 1, padding: Spacing.four, gap: Spacing.two },
  section: { gap: Spacing.two },
  errorBlock: { gap: Spacing.three },
});
