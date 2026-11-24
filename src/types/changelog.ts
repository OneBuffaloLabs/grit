// --- Types ---
export type ChangeType = 'launch' | 'feature' | 'update' | 'fix';

export interface ChangelogEntry {
  date: string;
  title: string;
  version: string;
  type: ChangeType;
  description: string;
  details?: string[];
}

export interface YearLog {
  year: string;
  entries: ChangelogEntry[];
}
