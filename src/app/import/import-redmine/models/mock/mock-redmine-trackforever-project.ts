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
        hash: '04d8985e9aa7e024ae4404be425588ee22ab4f5a280715157fc1bc383c92c068e54' +
        '5d2214729877647e9c53087a924c54932aab3df6a8430d25a80fa422b2ccf',
        prevHash: '',
        id: '5',
        projectId: 'Redmine:my-project',
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
        hash: 'f817f2f45393d1bfe08a886796b7c2bbf2445aa83933683e9305fc8cb87ba3755b54' +
        '0b504972cfc125f1993c5e5565149a36e89688a268d3f285825d4a3b6b6f',
        prevHash: '',
        id: '123',
        projectId: 'Redmine:my-project',
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
