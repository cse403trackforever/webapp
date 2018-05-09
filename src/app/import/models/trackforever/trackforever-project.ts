import { TrackForeverIssue } from './trackforever-issue';

export interface TrackForeverProject {
  hash: string;
  prevHash: string;
  id: string;
  ownerName: string;
  name: string;
  description: string;
  source: string;
  issues: Array<TrackForeverIssue>;
}
