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
  subject: string;
  description: string;
  done_ratio: Number;
  estimated_hours?: Number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
}
