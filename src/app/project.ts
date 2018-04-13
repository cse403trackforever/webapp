import {Issue} from './issue';

export class Project {
  id: String;
  ownerName: String;
  name: String;
  description: String;
  issues: Issue[];
}
