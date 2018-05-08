export interface RedmineProject {
  id: Number;
  name: string;
  identifier: string;
  description: string;
  homepage: string;
  is_public?: Boolean;
  created_on: string;
  updated_on: string;
}
