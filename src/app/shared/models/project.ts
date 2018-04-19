import { IssueSummary } from './issue-summary';

export interface Project {
  id: String;
  ownerName: String;
  name: String;
  description: String;
  source: String;
  issues: IssueSummary[];
}
