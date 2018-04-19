export interface GitHubProject {
  id: Number;
  name: String;
  description?: String;
  owner: any; // TODO replace with GitHubOwner
}
