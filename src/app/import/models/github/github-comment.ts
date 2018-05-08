import { GitHubOwner } from './github-owner';

export interface GitHubComment {
    id: Number;
    body: string;
    user: GitHubOwner;
}
