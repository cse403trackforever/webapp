import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { ImportSource } from '../import/models/import-source';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-page.component.html',
  styleUrls: ['./issue-page.component.css']
})
export class IssuePageComponent implements OnInit {
  issue: TrackForeverIssue;
  source: ImportSource;

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
    this.issueService.getProject(projectId).subscribe(project => {
      this.source = <ImportSource> project.source;
      this.issue = project.issues.get(issueId);
    });
  }

}
