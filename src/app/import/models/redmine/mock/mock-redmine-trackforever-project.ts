import { TrackForeverProject } from '../../trackforever/trackforever-project';

export const mockRedmineTrackForeverProject: TrackForeverProject = {
  hash: 'c25e05291ce5fb7b4323e03c1f3b896888e6ecf20ab6be15bb17f8a2bbc0c575d392aed1c285dea13452ace71011bbd41843049e1689674af65f225a6b064251',
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
  issues: [
      {
      hash: '1363f9e0ce04bb77dcc46c04bca1d8dd2c6f5c8fd6dbcb2b02d977152' +
      'bfc7cf08f1d38e323883399c39c8894bf395056d453eb94f35096a41ce18ddf3e9a7457',
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
    }, {
      hash: '977636e00fe4ad5f119ce7072856a9ab182b4d4962526c86fc' +
      '493df6e8a5e75e3a37483582a05708b6acecea0c47980a743381fd830030bb04584212f73f24ee',
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
};
