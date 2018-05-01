import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectSummary } from '../shared/models/project-summary';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  project: ProjectSummary;

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getProject();
  }

  getProject(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.issueService.getProject(projectId)
      .subscribe(project => this.project = project);
  }
}
