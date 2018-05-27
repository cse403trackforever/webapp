import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { AuthenticationService } from '../authentication/authentication.service';
import { mergeMap } from 'rxjs/operators';
import { AuthUser } from '../shared/models/auth-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project-page',
  templateUrl: './create-project-page.component.html',
  styleUrls: ['./create-project-page.component.css']
})
export class CreateProjectPageComponent implements OnInit {
  project: TrackForeverProject;
  isBusy = false;

  constructor(private issueService: IssueService,
              private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.initProject();
  }

  initProject(): void {
    this.project = {
      hash: '',
      prevHash: '',
      id: '',
      ownerName: '',
      name: '',
      description: '',
      source: 'Track Forever',
      issues: new Map()
    };
  }

  createProject(): void {
    this.isBusy = true;
    this.authService.getUser().pipe(
      mergeMap((user: AuthUser) => {
        this.project.ownerName = user.displayName;
        this.project.id = `${this.project.source}:${this.project.name}`;
        return this.issueService.setProject(this.project);
      })
    ).subscribe(() => {
      this.router.navigate([`/project/${this.project.id}`]);
    }, (err) => {
      console.log(err);
      this.isBusy = false;
    });
  }
}
