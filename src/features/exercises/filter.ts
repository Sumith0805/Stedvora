import type { Exercise, MuscleGroup } from '@/features/exercises/types';

export type MuscleFilter = MuscleGroup | 'all';

/** Filters by muscle group and by a search text (matches the name or the equipment). */
export function filterExercises(
  exercises: Exercise[],
  query: string,
  group: MuscleFilter
): Exercise[] {
  const text = query.trim().toLowerCase();
  return exercises.filter((exercise) => {
    if (group !== 'all' && exercise.muscle_group !== group) return false;
    if (!text) return true;
    return (
      exercise.name.toLowerCase().includes(text) ||
      exercise.equipment.toLowerCase().includes(text)
    );
  });
}