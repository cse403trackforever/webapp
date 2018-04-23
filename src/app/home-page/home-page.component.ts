import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue.service';
import { ProjectSummary } from '../shared/models/project-summary';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  title = "My Projects";
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
