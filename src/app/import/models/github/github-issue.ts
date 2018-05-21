import { GitHubOwner } from './github-owner';
import { GitHubLabel } from './github-label';

export interface GitHubIssue {
    comments_url: string;
    number: number;
    state: string;
    title: string;
    body: string;
    user: GitHubOwner;
    created_at?: string;
    updated_at?: string;
    closed_at?: string;
    assignees: Array<GitHubOwner>;
    labels: Array<GitHubLabel>;
}
