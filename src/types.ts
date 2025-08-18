export interface ChallengeDoc {
  _id: string; // Will now be a UUID
  _rev?: string;
  startDate: string;
  status: 'active' | 'failed' | 'completed';
  type: '75 Hard' | '75 Soft';
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
