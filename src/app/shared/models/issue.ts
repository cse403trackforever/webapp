import { Comment } from './comment';

export interface Issue {
  id: String;
  projectId: String;
  status: String;
  summary: String;
  labels: String[];
  comments: Comment[];
  submitterName: String;
  assignees: String[];
  timeCreated: Number;
  timeUpdated: Number;
  timeClosed: Number;
}
