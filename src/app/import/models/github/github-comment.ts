import { GitHubOwner } from "./github-owner";

export interface GitHubComment {
    id: Number;
    body: String;
    user: GitHubOwner;
}