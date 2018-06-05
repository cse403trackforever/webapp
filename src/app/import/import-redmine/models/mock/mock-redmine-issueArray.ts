import { RedmineIssueArray } from '../redmine-issueArray';

export const mockRedmineIssueArray: RedmineIssueArray = {
  issues: [
    {
      id: 5,
      project: {id: 1, name: 'my-project'},
      tracker: {id: 5, name: ''},
      status: {id: 5, name: 'closed'},
      priority: {id: 5, name: ''},
      author: {id: 5, name: 'David Dupre'},
      assigned_to: null,
      category: {id: 5, name: ''},
      subject: 'Issues have subjects!',
      description: 'Replace the project description with real content.',
      done_ratio: 5,
      estimated_hours: null,
      created_on: 'Sat May 05 2018 10:51:38 GMT-0700 (Pacific Summer Time)',
      updated_on: 'Sat May 05 2018 10:52:29 GMT-0700 (Pacific Summer Time)',
      closed_on: 'Sat May 05 2018 10:52:29 GMT-0700 (Pacific Summer Time)',
      journals: [
        {
          id: 720,
          user: {id: 6, name: 'Christopher Addison'},
          notes: 'this is a comment',
          created_on: 'Sat May 05 2018 10:51:38 GMT-0700 (Pacific Summer Time)',
          details: []
        },
        {
          id: 721,
          user: {id: 7, name: 'John Smith'},
          notes: '',
          created_on: 'Sat May 05 2018 10:51:38 GMT-0700 (Pacific Summer Time)',
          details: [
            {
              property: 'attachment',
              name: 123456,
              new_value: 'hello.png'
            }
          ]
        }
      ]
    },
    {
      id: 123,
      project: {id: 1, name: 'my-project'},
      tracker: {id: 123, name: ''},
      status: {id: 123, name: 'open'},
      priority: {id: 123, name: ''},
      author: {id: 123, name: 'denvercoder9'},
      assigned_to: {id: 123, name: 'denvercoder9'},
      category: {id: 123, name: ''},
      subject: 'Fix it',
      description: 'Fix the thing',
      done_ratio: 5,
      estimated_hours: null,
      created_on: 'Sat May 05 2018 10:56:37 GMT-0700 (Pacific Summer Time)',
      updated_on: 'Sat May 05 2018 10:56:37 GMT-0700 (Pacific Summer Time)',
      closed_on: null,
      journals: []
    }
  ],
  total_count: 2,
  offset: 0,
  limit: 100
};
