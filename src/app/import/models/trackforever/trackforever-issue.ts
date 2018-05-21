import { TrackForeverComment } from './trackforever-comment';

export interface TrackForeverIssue {
  hash: string;
  prevHash: string;
  id: string;
  projectId: string;
  status: string;
  summary: string;
  labels: Array<string>;
  comments: Array<TrackForeverComment>;
  submitterName: string;
  assignees: Array<string>;
  timeCreated: number;
  timeUpdated: number;
  timeClosed: number;
}
