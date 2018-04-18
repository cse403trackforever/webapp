import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../issue.service';
import { Issue } from '../shared/models/issue';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {
  @Input() projectId: String;
  @Input() issueId: String;

  issue: Issue;

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.getIssue();
  }

  getIssue(): void {
    this.issueService.getIssue(this.projectId, this.issueId)
      .subscribe(issue => this.issue = issue);
  }

}
