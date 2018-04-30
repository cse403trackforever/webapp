import { RedmineIssue } from './redmine-issue';

export interface RedmineIssueArray {
  issues: Array<RedmineIssue>;
  total_count: Number;
  offset: Number;
  limit: Number;
}
