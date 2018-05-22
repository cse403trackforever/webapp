import { TrackForeverProject } from '../../../models/trackforever/trackforever-project';

export const mockRedmineTrackForeverProject: TrackForeverProject = {
  hash: '2b93695f92bbdbd45d6fa30dd07e89d29baa1434d27d1171b527ba3f7d43c6460afd6a426b8809f0990fcb6cbb0c9fa4a338efcfe45c048b6122fa0accacc337',
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
        hash: '06c1035a4ef2ed12ae3d46aea1103ca814eb70201f729aa8819c61f5d2b0d4e65f' +
        '5e215b45a351260a05b2976deec6ecb8f2c3d3f2654a95f4bbe1b72e1d4719',
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
        hash: '942b40a7e4b1896128dbe96686c55e8d35d756f18c057164bd0ffcbfd7962933c83' +
        '3b4d916a9c19ed957a0c11819b4fe8370a501874dd338d0180d8a144c5c35',
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
