import { GitHubOwner } from './github-owner';

export interface GitHubProject {
    id: number;
    name: string;
    description?: string;
    owner: GitHubOwner;
}
