export interface ChallengeDoc {
  _id: string;
  _rev?: string;
  startDate: string;
  days: {
    [day: number]: {
      completed: boolean;
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
