import { TrackForeverIssue } from './trackforever-issue';

export interface TrackForeverProject {
  hash: String;
  id: String;
  ownerName: String;
  name: String;
  description: String;
  source: String;
  issues: Array<TrackForeverIssue>;
}
