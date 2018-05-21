export interface RedmineProject {
  id: number;
  name: string;
  identifier: string;
  description: string;
  homepage: string;
  is_public?: boolean;
  created_on: string;
  updated_on: string;
}
