import { RedmineIssueArray } from '../redmine-issueArray';

export const mockRedmineIssueArray: RedmineIssueArray = {
  issues: [
    {
      id: 5,
      project_id: {id: 5, name: 'my-project'},
      tracker: {id: 5, name: ''},
      status: {id: 5, name: 'closed'},
      priority: {id: 5, name: ''},
      author: {id: 5, name: 'David Dupre'},
      assigned_to: null,
      category: {id: 5, name: ''},
      subject: '',
      description: 'Replace the project description with real content.',
      done_ratio: 5,
      estimated_hours: null,
      created_on: 'Sat May 05 2018 10:51:38 GMT-0700 (Pacific Summer Time)',
      updated_on: 'Sat May 05 2018 10:52:29 GMT-0700 (Pacific Summer Time)',
      closed_on: 'Sat May 05 2018 10:52:29 GMT-0700 (Pacific Summer Time)'
    },
    {
      id: 123,
      project_id: {id: 123, name: 'my-project'},
      tracker: {id: 123, name: ''},
      status: {id: 123, name: 'open'},
      priority: {id: 123, name: ''},
      author: {id: 123, name: 'denvercoder9'},
      assigned_to: {id: 123, name: 'denvercoder9'},
      category: {id: 123, name: ''},
      subject: '',
      description: 'Fix the thing',
      done_ratio: 5,
      estimated_hours: null,
      created_on: 'Sat May 05 2018 10:56:37 GMT-0700 (Pacific Summer Time)',
      updated_on: 'Sat May 05 2018 10:56:37 GMT-0700 (Pacific Summer Time)',
      closed_on: null
    }
  ],
  total_count: 2,
  offset: 0,
  limit: 100
};
