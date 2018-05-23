import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { ImportSource } from '../import/models/import-source';
import { TrackForeverComment } from '../import/models/trackforever/trackforever-comment';
import { AuthenticationService } from '../authentication/authentication.service';
import { mergeMap } from 'rxjs/internal/operators';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-page.component.html',
  styleUrls: ['./issue-page.component.css']
})
export class IssuePageComponent implements OnInit {
  private sub: Subscription;
  issue: TrackForeverIssue;
  source: ImportSource;
  isAddingComment = false;
  faEllipsis = faEllipsisH;

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.getIssue();
  }

  getIssue(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const issueId = this.route.snapshot.paramMap.get('issueId');
    this.sub = this.issueService.getProject(projectId).subscribe(project => {
      this.source = <ImportSource> project.source;
      this.issue = project.issues.get(issueId);
    });
  }

  addComment(content: string, close?: boolean): void {
    this.isAddingComment = true;

    // make a copy of the issue
    const updatedIssue = JSON.parse(JSON.stringify(this.issue));

    // make changes to the issue
    const now = moment().valueOf() / 1000;
    if (close && updatedIssue.status !== 'closed') {
      updatedIssue.status = 'closed';
      updatedIssue.timeClosed = now;
    }
    updatedIssue.timeUpdated = now;

    this.authService.getUser().pipe(
      mergeMap(user => {
        const comment: TrackForeverComment = {
          commenterName: user.displayName,
          content
        };
        updatedIssue.comments.push(comment);
        return this.issueService.setIssue(updatedIssue);
      })
    ).subscribe(() => {
      this.isAddingComment = false;
      this.sub.unsubscribe();
      this.getIssue();
    });
  }

  removeComment(index: number) {
    // make a copy of the issue
    const updatedIssue: TrackForeverIssue = JSON.parse(JSON.stringify(this.issue));

    // remove the comment
    updatedIssue.comments.splice(index, 1);

    this.issueService.setIssue(updatedIssue)
      .subscribe(() => {
        this.sub.unsubscribe();
        this.getIssue();
      });
  }

  updateComment(index: number, comment: TrackForeverComment) {
    // TODO add edit functionality to the UI and use this function

    // make a copy of the issue
    const updatedIssue: TrackForeverIssue = JSON.parse(JSON.stringify(this.issue));

    updatedIssue.comments[index] = comment;

    this.issueService.setIssue(updatedIssue)
      .subscribe(() => {
        this.sub.unsubscribe();
        this.getIssue();
      });
  }
}
