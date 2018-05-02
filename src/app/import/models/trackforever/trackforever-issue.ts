import { TrackForeverComment } from './trackforever-comment';

export interface TrackForeverIssue {
  hash: String;
  id: String;
  projectId: String;
  status: String;
  summary: String;
  labels: Array<String>;
  comments: Array<TrackForeverComment>;
  submitterName: String;
  assignees: Array<String>;
  timeCreated: Number;
  timeUpdated: Number;
  timeClosed: Number;
}
