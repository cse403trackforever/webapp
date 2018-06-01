import { TrackForeverIssue } from './trackforever-issue';

export interface TrackForeverProject {
  /**
   * The SHA-3 hash of the string representation of the project.
   * Can be an empty string before syncing.
   *
   * Used to test for changes to this issue via a hash mismatch.
   */
  hash: string;

  /**
   * The previous SHA-3 hash of the string representation of the project.
   * Can be an empty string before syncing.
   *
   * Used to calculate the current hash. The value encodes the hashed history
   * of all previous iterations of the issue such that we can ensure the user
   * has merged changes before updating the server copy.
   *
   * The generated local hash is used to check for changes to this project.
   */
  prevHash: string;

  /**
   * The source name and a ID unique to the source in the following format:
   *
   * `${source}:${id}`
   */
  id: string;

  /**
   * The display name of the project's original owner
   */
  ownerName: string;

  /**
   * The project name
   */
  name: string;

  /**
   * The project description. This is interpreted as markdown by default.
   */
  description: string;

  /**
   * The source name. Must match the source found in the id field.
   *
   * e.g. 'GitHub'
   */
  source: string;

  /**
   * A map from this project's issue keyed by issue id
   */
  issues: Map<string, TrackForeverIssue>;
}
