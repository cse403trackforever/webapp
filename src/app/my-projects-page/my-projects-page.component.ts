import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';

@Component({
  selector: 'app-my-projects-page',
  templateUrl: './my-projects-page.component.html',
  styleUrls: ['./my-projects-page.component.css']
})
export class MyProjectsPageComponent implements OnInit {
  projects: TrackForeverProject[];

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects(): void {
    this.issueService.getProjects()
      .subscribe(projects => this.projects = projects);
  }

}
