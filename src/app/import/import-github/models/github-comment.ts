import { GitHubOwner } from './github-owner';

export interface GitHubComment {
  id: number;
  body: string;
  user: GitHubOwner;
}
