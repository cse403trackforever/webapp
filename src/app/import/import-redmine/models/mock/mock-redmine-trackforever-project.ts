import { TrackForeverProject } from '../../../models/trackforever/trackforever-project';

export const mockRedmineTrackForeverProject: TrackForeverProject = {
  hash: '',
  prevHash: '',
  id: 'Redmine:1',
  ownerName: '',
  name: 'Boring Project',
  description: 'Lorem Ipsum is simply dummy text of the printing and ' +
   'typesetting industry. Lorem Ipsum has been the industry\'s standard ' +
   'dummy text ever since the 1500s, when an unknown printer took a ' +
   'galley of type and scrambled it to make a type specimen book. It ' +
   'has survived not only five centuries, but also the leap into ' + 'electronic typesetting, remaining essentially unchanged. It ' +
   'was popularised in the 1960s with the release of Letraset sheets ' +
   'containing Lorem Ipsum passages, and more recently with desktop ' +
   'publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  source: 'Redmine',
  issues: new Map([
    [
      '5',
      {
        hash: '',
        prevHash: '',
        id: '5',
        projectId: 'Redmine:my-project',
        status: 'closed',
        summary: 'Replace the project description with real content.',
        labels: [],
        comments: [],
        submitterName: 'David Dupre',
        assignees: [],
        timeCreated: 1525542698,
        timeUpdated: 1525542749,
        timeClosed: 1525542749
      }
    ],
    [
      '123',
      {
        hash: '',
        prevHash: '',
        id: '123',
        projectId: 'Redmine:my-project',
        status: 'open',
        summary: 'Fix the thing',
        labels: [],
        comments: [],
        submitterName: 'denvercoder9',
        assignees: ['denvercoder9'],
        timeCreated: 1525542997,
        timeUpdated: 1525542997,
        timeClosed: null
      }
    ]
  ])
};
