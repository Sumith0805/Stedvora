export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'legs',
  'glutes',
  'core',
  'cardio',
  'other',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  legs: 'Legs',
  glutes: 'Glutes',
  core: 'Core',
  cardio: 'Cardio',
  other: 'Other',
};

export type Exercise = {
  id: string;
  /** null = built-in exercise shared by everyone; otherwise the owner's custom exercise */
  user_id: string | null;
  name: string;
  muscle_group: MuscleGroup;
  equipment: string;
};

export function equipmentLabel(raw: string): string {
  const text = raw.trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Other';
}