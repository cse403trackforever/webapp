import {Comment} from './comment';

export class Issue {
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
