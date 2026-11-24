// --- Types ---
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type ChallengeType = 'hard' | 'soft' | 'balanced' | 'custom';

export type ReadingRuleType = 'non_fiction' | 'any_book' | 'book_or_audio';
export type DietRuleType = 'strict' | 'one_cheat_week' | 'cut_vice';
export type AlcoholRuleType = 'none' | 'one_cheat_week' | 'no_limit';
export type PhotoRuleType = 'daily' | 'weekly' | 'first_last' | 'none';

export interface ChallengeRules {
  workouts: number;
  workoutDuration: number;
  workoutDurations: number[];
  outdoorWorkout: boolean;
  water: number;
  reading: number;
  readingType: ReadingRuleType;
  dietRule: DietRuleType;
  vice?: string;
  alcoholRule: AlcoholRuleType;
  photoRule: PhotoRuleType;
  trackWeight: boolean;
  trackMeasurements: boolean;
  useDailyJournal: boolean;
}

export interface DailyMeasurements {
  neck?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  thighs?: number;
  calves?: number;
  biceps?: number;
  forearms?: number;
}

export interface ChallengeDayTasks {
  diet: boolean;
  workout1: boolean;
  workout2: boolean;
  workout3?: boolean;
  water: boolean;
  reading: boolean;
  progressPhoto: boolean;
}

export interface ChallengeDay {
  completed: boolean;
  photoAttached: boolean;
  journal?: string;
  weight?: number;
  measurements?: DailyMeasurements;
  waterConsumed?: number;
  tasks: ChallengeDayTasks;
}

export interface ChallengeMetaDoc {
  _id: string;
  _rev?: string;
  docType: 'challenge_meta';
  name: string;
  startDate: string; // YYYY-MM-DD local calendar date string
  status: 'active' | 'failed' | 'completed';
  type: ChallengeType;
  duration: number;
  completionDate?: string;
  rules: ChallengeRules;
}

export interface ChallengeDayDoc extends ChallengeDay {
  _id: string; // Composite key: day:{challengeId}:{001..075}
  _rev?: string;
  docType: 'challenge_day';
  challengeId: string;
  day: number;
}

export interface PhotoDoc {
  _id: string; // Composite key: photo:{challengeId}:{001..075}
  _rev?: string;
  docType: 'photo';
  challengeId: string;
  day: number;
  mimeType: string;
  updatedAt: string;
}

/**
 * Aggregated challenge view model used by React context and UI components,
 * also matching the legacy v1 monolithic PouchDB document shape.
 */
export interface ChallengeDoc {
  _id: string;
  _rev?: string;
  docType: 'challenge';
  name: string;
  startDate: string; // YYYY-MM-DD local calendar date string
  status: 'active' | 'failed' | 'completed';
  type: ChallengeType;
  duration: number;
  completionDate?: string;
  rules: ChallengeRules;
  days: {
    [day: number]: ChallengeDay;
  };
}

export type GritDbDoc = ChallengeMetaDoc | ChallengeDayDoc | PhotoDoc | ChallengeDoc;

export interface ChallengeVariant {
  id: ChallengeType;
  title: string;
  icon: IconDefinition;
  color: string;
  tagline: string;
  description: string;
  rules: string[];
  whyItWorks: string;
}
