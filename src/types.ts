export interface ChallengeDoc {
  _id: string;
  _rev?: string;
  startDate: string;
  status?: 'failed' | 'completed';
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
