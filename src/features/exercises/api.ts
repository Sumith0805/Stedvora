import type { Exercise } from '@/features/exercises/types';
import { supabase } from '@/lib/supabase';

export type FetchExercisesResult = { data: Exercise[]; error: string | null };

const LOAD_ERROR = 'Could not load exercises. Check your connection and try again.';

/** Loads built-in exercises plus the logged-in user's custom ones (Row Level Security decides). */
export async function fetchExercises(): Promise<FetchExercisesResult> {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('id, user_id, name, muscle_group, equipment')
      .order('name', { ascending: true })
      .limit(1000);

    if (error) {
      console.warn('Loading exercises failed.', error.message);
      return { data: [], error: LOAD_ERROR };
    }
    return { data: (data ?? []) as Exercise[], error: null };
  } catch (error) {
    console.warn('Loading exercises failed.', error);
    return { data: [], error: LOAD_ERROR };
  }
}