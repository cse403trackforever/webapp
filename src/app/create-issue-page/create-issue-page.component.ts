import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { forkJoin } from 'rxjs';
import { AuthUser } from '../shared/models/auth-user';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-create-issue-page',
  templateUrl: './create-issue-page.component.html',
  styleUrls: ['./create-issue-page.component.css']
})
export class CreateIssuePageComponent implements OnInit {
  issue: TrackForeverIssue;
  user: AuthUser;
  project: TrackForeverProject;
  commentContent: string;

  isBusy = true;

  private static toggleListItem(arr: any[], item: string): void {
    const index = arr.indexOf(item);
    if (index < 0) {
      arr.push(item);
    } else {
      arr.splice(index, 1);
    }
  }

  constructor(private issueService: IssueService,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.initIssue();
  }

  initIssue(): void {
    this.isBusy = true;
    const projectId = this.route.snapshot.paramMap.get('projectId');

    forkJoin(
      this.issueService.getProject(projectId),
      this.authService.getUser().pipe(first())
    ).subscribe(([project, user]) => {
      const nextId = this.nextIssueId(project);
      this.project = project;
      this.user = user;

      this.issue = {
        hash: null,
        prevHash: null,
        id: isNaN(nextId) ? '' : nextId + '',
        projectId,
        status: 'open',
        summary: '',
        labels: [],
        comments: [],
        submitterName: user.displayName,
        assignees: []
      };

      this.commentContent = undefined;

      this.isBusy = false;
    });
  }

  /**
   * @param {TrackForeverProject} project
   * @returns {string} The next id if ids are numeric, otherwise NaN
   */
  nextIssueId(project: TrackForeverProject): number {
    if (project.issues.size === 0) {
      return 1;
    }

    let max = -Infinity;
    project.issues.forEach((val, key) => {
      const id = +key;
      if (isNaN(id)) {
        max = id;
        return;
      }
      if (id > max) {
        max = id;
      }
    });
    return (max + 1);
  }

  assign(assignee: string): void {
    CreateIssuePageComponent.toggleListItem(this.issue.assignees, assignee);
  }

  applyLabel(label: string): void {
    CreateIssuePageComponent.toggleListItem(this.issue.labels, label);
  }

  onSubmit(): void {
    if (this.commentContent) {
      this.issue.comments.push({
        commenterName: this.user.displayName,
        content: this.commentContent
      });
    }
    this.issue.timeCreated = moment().valueOf() / 1000;

    this.isBusy = true;
    this.issueService.setIssue(this.issue).subscribe(() => {
      this.router.navigate([`/project/${this.project.id}/issue/${this.issue.id}`]);
    }, (err) => {
      console.log(err);
      this.initIssue();
    });
  }
}
