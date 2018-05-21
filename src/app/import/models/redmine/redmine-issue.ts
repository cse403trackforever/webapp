import { RedmineIssueSubstructure } from './redmine-issue-substructure';


export interface RedmineIssue {
  id: number;
  project_id: RedmineIssueSubstructure;
  tracker: RedmineIssueSubstructure;
  status: RedmineIssueSubstructure;
  priority: RedmineIssueSubstructure;
  author: RedmineIssueSubstructure;
  assigned_to?: RedmineIssueSubstructure;
  category: RedmineIssueSubstructure;
  subject: string;
  description: string;
  done_ratio: number;
  estimated_hours?: number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
}
