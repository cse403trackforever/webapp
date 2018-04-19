import { Issue } from '../issue';

export const mockIssue: Issue = {
  id: '123',
  projectId: '456',
  status: 'open',
  summary: 'Everything is broken please fix',
  labels: [
    'bug'
  ],
  comments: [
    {
      commenterName: 'David Dupre',
      content: 'Why is this app so broken?'
    }
  ],
  submitterName: 'David Dupre',
  assignees: [],
  timeCreated: 1524001886,
  timeUpdated: 1524001886,
  timeClosed: -1,
};
