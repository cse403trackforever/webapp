import { Component, OnInit } from '@angular/core';
import { ProjectSummary } from '../shared/models/project-summary';
import { IssueService } from '../issue/issue.service';

@Component({
  selector: 'app-my-projects-page',
  templateUrl: './my-projects-page.component.html',
  styleUrls: ['./my-projects-page.component.css']
})
export class MyProjectsPageComponent implements OnInit {
  projects: ProjectSummary[];

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects(): void {
    this.issueService.getProjects()
      .subscribe(projects => this.projects = projects);
  }

}
