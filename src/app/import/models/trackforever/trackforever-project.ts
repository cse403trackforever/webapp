import { TrackForeverIssue } from './trackforever-issue';

export interface TrackForeverProject {
  hash: string;
  id: string;
  ownerName: string;
  name: string;
  description: string;
  source: string;
  issues: Array<TrackForeverIssue>;
}
