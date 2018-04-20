import { GitHubOwner } from "./github-owner";
import { GitHubLabel } from "./github-label";

export interface GitHubIssue {
    comments_url: String;
    number: Number;
    state: String;
    title: String;
    body: String;
    user: GitHubOwner;
    created_at?: String;
    updated_at?: String;
    closed_at?: String;
    assignees: Array<GitHubOwner>;
    labels: Array<GitHubLabel>
}