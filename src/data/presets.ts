import { ChallengeType, ChallengeRules } from '@/types';

export const CHALLENGE_PRESETS: Record<ChallengeType, ChallengeRules> = {
  soft: {
    workouts: 1,
    workoutDuration: 45,
    workoutDurations: [45],
    outdoorWorkout: false,
    water: 64,
    reading: 10,
    readingType: 'book_or_audio', // 10 pages or 20 mins audio
    dietRule: 'cut_vice',
    alcoholRule: 'no_limit',
    photoRule: 'first_last', // Default to First & Last
  },
  balanced: {
    workouts: 2,
    workoutDuration: 30,
    workoutDurations: [45, 15],
    outdoorWorkout: false,
    water: 100,
    reading: 10,
    readingType: 'any_book', // Fiction, comics, etc.
    dietRule: 'one_cheat_week',
    alcoholRule: 'one_cheat_week',
    photoRule: 'weekly',
  },
  hard: {
    workouts: 2,
    workoutDuration: 45,
    workoutDurations: [45, 45],
    outdoorWorkout: true,
    water: 128,
    reading: 10,
    readingType: 'non_fiction', // Strict
    dietRule: 'strict',
    alcoholRule: 'none',
    photoRule: 'daily',
  },
  custom: {
    workouts: 1,
    workoutDuration: 30,
    workoutDurations: [30, 30, 30],
    outdoorWorkout: false,
    water: 64,
    reading: 10,
    readingType: 'any_book',
    dietRule: 'one_cheat_week',
    alcoholRule: 'one_cheat_week',
    photoRule: 'none',
  },
};
