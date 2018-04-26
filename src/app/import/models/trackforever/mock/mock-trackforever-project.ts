import { TrackForeverProject } from '../trackforever-project';

export const mockTrackforeverProject: TrackForeverProject = {
  id: 'my-project',
  ownerName: 'John Smith',
  name: 'Boring Project',
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard ' +
  'dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has ' +
  'survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised ' +
  'in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software ' +
  'like Aldus PageMaker including versions of Lorem Ipsum.',
  source: 'Google Code',
  issues: [
    {
      id: '5',
      projectId: 'my-project',
      status: 'closed',
      summary: 'Replace the project description with real content.',
      labels: [],
      comments: [
        {
          commenterName: 'David Dupre',
          content: 'Why is this app so broken?'
        }
      ],
      submitterName: 'David Dupre',
      assignees: [],
      timeCreated: 1523577466,
      timeUpdated: 1523578696,
      timeClosed: 1523578696
    },
    {
      id: '123',
      projectId: 'my-project',
      status: 'open',
      summary: 'Fix the thing',
      labels: [
        'bug'
      ],
      comments: [
        {
          commenterName: 'Christopher Addison',
          content: 'This is not a bug.'
        },
        {
          commenterName: 'denvercoder9',
          content: 'Yes it is.'
        },
      ],
      submitterName: 'denvercoder9',
      assignees: [
        'denvercoder9'
      ],
      timeCreated: 1523574466,
      timeUpdated: 1523574466,
      timeClosed: -1,
    }
  ]
};
