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
  page = 1;
  pageSize = 10; // number of items per page

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects(): void {
    this.issueService.getProjects()
      .subscribe(projects => this.projects = projects);
  }

  getProjectsForCurrentPage(): TrackForeverProject[] {
    const start = (this.page - 1) * this.pageSize;
    return this.projects.slice(start, start + this.pageSize);
  }

}
