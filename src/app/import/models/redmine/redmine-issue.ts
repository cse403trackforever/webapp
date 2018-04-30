import { RedmineIssueSubstructure } from './redmine-issue-substructure';


export interface RedmineIssue {
  id: Number;
  project_id: RedmineIssueSubstructure;
  tracker: RedmineIssueSubstructure;
  status: RedmineIssueSubstructure;
  priority: RedmineIssueSubstructure;
  author: RedmineIssueSubstructure;
  assigned_to?: RedmineIssueSubstructure;
  category: RedmineIssueSubstructure;
  subject: String;
  description: String;
  done_ratio: Number;
  estimated_hours?: Number;
  created_on: String;
  updated_on: String;
  closed_on?: String;
}
