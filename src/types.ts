import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type ChallengeType = 'hard' | 'soft' | 'balanced' | 'custom';

export interface ChallengeRules {
  workouts: number;
  workoutDuration: number;
  workoutDurations: number[];
  outdoorWorkout: boolean;
  water: number;
  reading: number;
  noCheatMeals: boolean;
  noAlcohol: boolean;
  progressPhoto: boolean;
}

export interface ChallengeDoc {
  _id: string;
  _rev?: string;
  docType: 'challenge';
  startDate: string;
  status: 'active' | 'failed' | 'completed';
  type: ChallengeType;
  duration: number;
  completionDate?: string;
  rules: ChallengeRules;
  days: {
    [day: number]: {
      completed: boolean;
      photoAttached: boolean;
      journal?: string;
      weight?: number;
      tasks: {
        diet: boolean;
        workout1: boolean;
        workout2: boolean;
        water: boolean;
        reading: boolean;
        progressPhoto: boolean;
      };
    };
  };
}

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
