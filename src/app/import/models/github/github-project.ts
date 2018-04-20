import { GitHubOwner } from "./github-owner";

export interface GitHubProject {
    id: Number;
    name: String;
    description?: String;
    owner: GitHubOwner;
}
