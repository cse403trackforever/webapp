import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/models/project';
import { IssueService } from '../issue.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  project: Project;

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
