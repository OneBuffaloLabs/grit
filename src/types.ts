export interface ChallengeDoc {
  _id: string;
  _rev?: string;
  docType: 'challenge';
  startDate: string;
  status: 'active' | 'failed' | 'completed';
  type: '75 Hard' | '75 Soft';
  duration: number;
  completionDate?: string;
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

export type ChallengeType = 'soft' | 'balanced' | 'hard';

export interface ChallengeVariant {
  id: ChallengeType;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
  tagline: string;
  description: string;
  rules: string[];
  whyItWorks: string;
}
