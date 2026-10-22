import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase settings. Copy .env.example to .env, fill in both values, ' +
      'then restart with: npx expo start -c'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage as any, // same pattern as Supabase's official Expo guide
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Refresh the login session only while the app is in the foreground.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});