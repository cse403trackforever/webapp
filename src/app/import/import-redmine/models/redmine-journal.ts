import { RedmineIssueSubstructure } from './redmine-issue-substructure';
import { RedmineJournalDetail } from './redmine-journal-detail';

/**
 * A Redmine "journal" is either a comment or a change to an issue. Journals with non-empty notes are comments, while journals with
 * non-empty details are other changes (e.g. an attachment).
 *
 * See <http://www.redmine.org/projects/redmine/wiki/Rest_IssueJournals>
 */
export interface RedmineJournal {
  id: number;
  user: RedmineIssueSubstructure;
  notes: string;
  created_on: string;
  details: RedmineJournalDetail[];
}
