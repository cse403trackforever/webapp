import { Issue } from '../issue';

export const mockIssue: Issue = {
  id: '123',
  projectId: '456',
  status: 'open',
  summary: 'Navigation bar isn\'t hidden when user isn\'t signed in',
  labels: [
    'bug'
  ],
  comments: [
    {
      commenterName: 'David Dupre',
      content: 'Why is this app so broken?'
    },
    {
      commenterName: 'Christine Ta',
      content: 'Idk man'
    },
    {
      commenterName: 'David Dupre',
      content: 'Plz fixxxxx'
    }
  ],
  submitterName: 'David Dupre',
  assignees: [],
  timeCreated: 1524001886,
  timeUpdated: 1524001886,
  timeClosed: -1,
};
