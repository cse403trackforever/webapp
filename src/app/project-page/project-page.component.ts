import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { ExportService } from '../export/export.service';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  project: TrackForeverProject;
  issues: Array<TrackForeverIssue>;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faSort = faSort;
  page = 1;
  pageSize = 10; // number of items per page

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private exportService: ExportService,
  ) { }

  ngOnInit() {
    this.getProject();
  }

  getIssuesForCurrentPage(): TrackForeverIssue[] {
    const start = (this.page - 1) * this.pageSize;
    return this.issues.slice(start, start + this.pageSize);
  }

  getProject(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.issueService.getProject(projectId)
      .subscribe(project => {
        this.project = project;
        this.issues = Array.from(project.issues, (v, k) => {
          return v[1];
        });
      });
  }

  export(): void {
    this.exportService.download(this.project);
  }
}
