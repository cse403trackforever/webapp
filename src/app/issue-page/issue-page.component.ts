import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { ImportSource } from '../import/models/import-source';
import { TrackForeverComment } from '../import/models/trackforever/trackforever-comment';
import { AuthenticationService } from '../authentication/authentication.service';
import { mergeMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { faEllipsisH, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthUser } from '../shared/models/auth-user';

@Component({
  selector: 'app-issue-page',
  templateUrl: './issue-page.component.html',
  styleUrls: ['./issue-page.component.css']
})
export class IssuePageComponent implements OnInit {
  private sub: Subscription;
  issue: TrackForeverIssue;
  source: ImportSource;
  projectName: string;

  statuses = new Set();

  isAddingComment = false;
  isEditingSummary = false;
  isEditingStatus = false;
  editedCommentIndex = -1;

  faEllipsis = faEllipsisH;
  faEdit = faEdit;
  faCheck = faCheck;

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
      this.projectName = project.name;
      this.issue = project.issues.get(issueId);

      // populate statuses
      project.issues.forEach((issue, id) => {
        this.statuses.add(issue.status);
      });
    });
  }

  setEditingSummary(editing: boolean): void {
    this.isEditingSummary = editing;
  }

  saveSummary(summary: string): void {
    // make a copy of the issue
    const updatedIssue: TrackForeverIssue = JSON.parse(JSON.stringify(this.issue));

    updatedIssue.summary = summary;

    this.issueService.setIssue(updatedIssue)
      .subscribe(() => {
        this.isEditingSummary = false;
        this.sub.unsubscribe();
        this.getIssue();
      });
  }

  setStatus(status: string): void {
    // make a copy of the issue
    const updatedIssue: TrackForeverIssue = JSON.parse(JSON.stringify(this.issue));

    updatedIssue.status = status;

    this.issueService.setIssue(updatedIssue)
      .subscribe(() => {
        this.isEditingStatus = false;
        this.sub.unsubscribe();
        this.getIssue();
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
      mergeMap((user: AuthUser) => {
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

  /**
   * Start editing a comment but don't yet update it through the issue service
   * @param {number} index the index of the comment in the issue's comments array
   */
  editComment(index: number) {
    this.editedCommentIndex = index;
  }

  cancelCommentEdit() {
    this.editedCommentIndex = -1;
  }

  updateComment(index: number, content: string) {
    // make a copy of the issue
    const updatedIssue: TrackForeverIssue = JSON.parse(JSON.stringify(this.issue));

    updatedIssue.comments[index].content = content;
    this.editedCommentIndex = -1;

    this.issueService.setIssue(updatedIssue)
      .subscribe(() => {
        this.sub.unsubscribe();
        this.getIssue();
      });
  }

  assign(assignee: string) {
    // make a copy of the issue
    const updatedIssue: TrackForeverIssue = JSON.parse(JSON.stringify(this.issue));

    // toggle assignment
    if (this.issue.assignees.includes(assignee)) {
      updatedIssue.assignees.splice(updatedIssue.assignees.indexOf(assignee), 1);
    } else {
      updatedIssue.assignees.push(assignee);
    }

    this.issueService.setIssue(updatedIssue)
      .subscribe(() => {
        this.sub.unsubscribe();
        this.getIssue();
      });
  }

  applyLabel(label: string) {
    // make a copy of the issue
    const updatedIssue: TrackForeverIssue = JSON.parse(JSON.stringify(this.issue));

    // apply the label
    if (this.issue.labels.includes(label)) {
      updatedIssue.labels.splice(updatedIssue.labels.indexOf(label), 1);
    } else {
      updatedIssue.labels.push(label);
    }

    this.issueService.setIssue(updatedIssue)
      .subscribe(() => {
        this.sub.unsubscribe();
        this.getIssue();
      });
  }
}
