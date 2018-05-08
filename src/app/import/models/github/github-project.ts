import { GitHubOwner } from './github-owner';

export interface GitHubProject {
    id: Number;
    name: string;
    description?: string;
    owner: GitHubOwner;
}
