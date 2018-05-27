import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { faSort, faSortUp, faSortDown, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { ExportService } from '../export/export.service';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { ImportTrackForeverService } from '../import/import-trackforever/import-trackforever.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  project: TrackForeverProject;
  issues: Array<TrackForeverIssue>;
  issuesForCurrentPage: Array<TrackForeverIssue>;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faSort = faSort;
  faCheckSquare = faCheckSquare;

  projectSub: Subscription;
  page = 1;
  pageSize = 15; // number of items per page
  queryString = '';

  labels = new Set();
  labelFilters = new Set();

  isEditingProject = false;

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private exportService: ExportService,
  ) { }

  ngOnInit() {
    this.getProject();
  }

  updateIssues(): void {
    const query = this.queryString.toLowerCase();
    this.page = 1;

    this.issues = Array.from(this.project.issues.values())

      // filter based on search query
      .filter(i => i.id.includes(query) || i.summary.toLowerCase().includes(query))

      // filter based on labels
      .filter(i => Array.from(this.labelFilters).every(l => i.labels.includes(l)));

    this.issuesForCurrentPage = this.getIssuesForCurrentPage();
  }

  getIssuesForCurrentPage(): TrackForeverIssue[] {
    const start = (this.page - 1) * this.pageSize;
    return this.issues.slice(start, start + this.pageSize);
  }

  getProject(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.projectSub = this.issueService.getProject(projectId)
      .subscribe(project => {
        project.issues.forEach(issue => {
          issue.labels.forEach(label => this.labels.add(label));
        });
        this.project = project;
        this.updateIssues();
      });
  }

  export(): void {
    this.exportService.download(this.project);
  }

  toggleLabelFilter(label: string): void {
    if (this.labelFilters.has(label)) {
      this.labelFilters.delete(label);
    } else {
      this.labelFilters.add(label);
    }
    this.updateIssues();
  }

  editProject(name: string, description: string): void {
    this.isEditingProject = false;

    const updatedProject = ImportTrackForeverService.fromJson(ImportTrackForeverService.toJson(this.project));
    updatedProject.name = name;
    updatedProject.description = description;

    this.issueService.setProject(updatedProject)
      .subscribe(() => {
        this.projectSub.unsubscribe();
        this.getProject();
      });
  }
}
