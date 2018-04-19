import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../issue.service';
import { Issue } from '../shared/models/issue';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-page.component.html',
  styleUrls: ['./issue-page.component.css']
})
export class IssuePageComponent implements OnInit {
  issue: Issue;

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getIssue();
  }

  getIssue(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const issueId = this.route.snapshot.paramMap.get('issueId');
    this.issueService.getIssue(projectId, issueId)
      .subscribe(issue => this.issue = issue);
  }

}
