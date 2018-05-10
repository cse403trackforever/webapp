import { TrackForeverProject } from '../../trackforever/trackforever-project';

export const mockRedmineTrackForeverProject: TrackForeverProject = {
  hash: '971c7c0974cdd0241c0f7c7ab48db543f0cea53acc26a6b68548f306b1deaf6c93b922d76208c4cd5e5789f110bd709aabdcefec31cf0eb6cf17b8b8ba7995fa',
  prevHash: '',
  id: '1',
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
        hash: 'a789de4cde90f514c9374b7603622022ac877b7ee9a2d1bbeb68e0a563bd' +
        '7179ba718b5e55e34be0b5dcc3236202eb89b7f9124d898811d7b752a5db2ed5c932',
        prevHash: '',
        id: '5',
        projectId: 'my-project',
        status: 'closed',
        summary: 'Replace the project description with real content.',
        labels: [],
        comments: [],
        submitterName: 'David Dupre',
        assignees: [],
        timeCreated: 1525542698000,
        timeUpdated: 1525542749000,
        timeClosed: 1525542749000
      }
    ],
    [
      '123',
      {
        hash: '5077771b88ffd0b7c50f1d9e0e1968ff30118e71888f238f40c812aeacf0c22' +
        'b1a1aa0631878659c90298e798d04f184bbcd619682532441ff2e05543d002a74',
        prevHash: '',
        id: '123',
        projectId: 'my-project',
        status: 'open',
        summary: 'Fix the thing',
        labels: [],
        comments: [],
        submitterName: 'denvercoder9',
        assignees: ['denvercoder9'],
        timeCreated: 1525542997000,
        timeUpdated: 1525542997000,
        timeClosed: -1
      }
    ]
  ])
};
