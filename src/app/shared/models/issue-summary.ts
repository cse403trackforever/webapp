export interface IssueSummary {
  id: String;
  projectId: String;
  status: String;
  summary: String;
  labels: String[];
  numComments: Number;
  submitterName: String;
  assignees: String[];
  timeCreated: Number;
  timeUpdated: Number;
  timeClosed: Number;
}
