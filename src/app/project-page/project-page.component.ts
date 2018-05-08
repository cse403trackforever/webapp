import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { ExportService } from '../export/export.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  project: TrackForeverProject;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faSort = faSort;

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private exportService: ExportService,
  ) { }

  ngOnInit() {
    this.getProject();
  }

  getProject(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.issueService.getProject(projectId)
      .subscribe(project => this.project = project);
  }

  export(): void {
    this.exportService.download(this.project);
  }
}
