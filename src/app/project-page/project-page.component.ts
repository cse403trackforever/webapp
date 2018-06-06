import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { faSort, faSortUp, faSortDown, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { ExportService } from '../export/export.service';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { ConvertTrackforeverService } from '../import/import-trackforever/convert-trackforever.service';
import { Subscription } from 'rxjs';
import { SyncService } from '../sync/sync.service';

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

  assignees = new Set();
  assigneeFilters = new Set();

  submitters = new Set();
  submitterFilter = '';

  statuses = new Set();
  statusFilters = new Set();

  modified = false;

  isEditingProject = false;

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private exportService: ExportService,
  ) { }

  ngOnInit() {
    this.getProject();
  }

  // update list of issus displayed based on set filters
  updateIssues(): void {
    const query = this.queryString.toLowerCase();
    this.page = 1;

    this.issues = Array.from(this.project.issues.values())

      // filter based on search query
      .filter(i => i.id.includes(query) || i.summary.toLowerCase().includes(query))

      // filter based on labels
      .filter(i => Array.from(this.labelFilters).every(l => i.labels.includes(l)))

      // filter based on assignee
      .filter(i => Array.from(this.assigneeFilters).every(a => i.assignees.includes(a)))

      // filter based on submitter, if there is no filter set we show all issues
      .filter(i => (i.submitterName === this.submitterFilter) || (this.submitterFilter === ''))

      // filter by status
      .filter(i => this.statusFilters.has(i.status));

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
          issue.assignees.forEach(assignee => this.assignees.add(assignee));
          this.submitters.add(issue.submitterName);
          this.statuses.add(issue.status);
          this.statusFilters.add(issue.status);
        });
        this.project = project;
        this.modified = SyncService.hasChanged(project);
        this.updateIssues();
      });
  }

  export(): void {
    this.exportService.download(this.project);
  }

  toggleLabelFilter(label: string): void {
    this.toggleFilter(this.labelFilters, label);
  }

  toggleAssigneeFilter(assignee: string): void {
    this.toggleFilter(this.assigneeFilters, assignee);
  }

  toggleStatusFilter(status: string): void {
    this.toggleFilter(this.statusFilters, status);
  }

  toggleSubmitterFilter(submitter: string): void {
    if (this.submitterFilter === submitter) {
      this.submitterFilter = '';
    } else {
      this.submitterFilter = submitter;
    }

    this.updateIssues();
  }

  editProject(name: string, description: string): void {
    this.isEditingProject = false;

    const updatedProject = ConvertTrackforeverService.fromJson(ConvertTrackforeverService.toJson(this.project));
    updatedProject.name = name;
    updatedProject.description = description;

    this.issueService.setProject(updatedProject)
      .subscribe(() => {
        this.projectSub.unsubscribe();
        this.getProject();
      });
  }

  private toggleFilter(filterType: Set<any>, filter: string): void {
    if (filterType.has(filter)) {
      filterType.delete(filter);
    } else {
      filterType.add(filter);
    }
    this.updateIssues();
  }
}
