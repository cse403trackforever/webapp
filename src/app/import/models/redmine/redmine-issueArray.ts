import { RedmineIssue } from './redmine-issue';

export interface RedmineIssueArray {
  issues: Array<RedmineIssue>;
  total_count: number;
  offset: number;
  limit: number;
}
