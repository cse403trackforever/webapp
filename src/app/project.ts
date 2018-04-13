import {Issue} from './issue';

export interface Project {
  id: String;
  ownerName: String;
  name: String;
  description: String;
  issues: Issue[];
}
