import { TrackForeverComment } from './trackforever-comment';

export interface TrackForeverIssue {
  /**
   * The SHA-3 hash of the string representation of the issue.
   * Can be an empty string before syncing.
   *
   * Used to test for changes to this issue via a hash mismatch.
   */
  hash: string;

  /**
   * The previous SHA-3 hash of the string representation of the issue.
   * Can be an empty string before syncing.
   *
   * Used to calculate the current hash. The value encodes the hashed history
   * of all previous iterations of the issue such that we can ensure the user
   * has merged changes before updating the server copy.
   *
   * The generated local hash is used to check for changes to this issue.
   */
  prevHash: string;

  /**
   * The ID for this issue unique to its project
   */
  id: string;

  /**
   * The ID of the project this issue belongs to
   */
  projectId: string;

  /**
   * The status for this issue. The status is set to 'open' by default when creating an issue and 'closed' after closing, but the status can
   * be any string.
   */
  status: string;

  /**
   * The title for the issue. Interpreted as plain text
   */
  summary: string;

  /**
   * An array of this issue's labels or 'tags'
   */
  labels: Array<string>;

  /**
   * An array of this issue's comments in order of submission
   */
  comments: Array<TrackForeverComment>;

  /**
   * The display name or username for the issue submitter
   */
  submitterName: string;

  /**
   * An array of this issue's assignees' display names or usernames
   */
  assignees: Array<string>;

  /**
   * The time this issue was created as a unix timestamp in seconds
   */
  timeCreated?: number;

  /**
   * The time this issue was last updated as a unix timestamp in seconds
   */
  timeUpdated?: number;

  /**
   * The time this issue was closed as a unix timestamp in seconds
   */
  timeClosed?: number;
}
