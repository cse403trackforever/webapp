import { TrackForeverIssue } from './trackforever-issue';

export interface TrackForeverProject {
    id: String;
    ownerName: String;
    name: String;
    description: String;
    source: String;
    issues: Array<TrackForeverIssue>;
}
