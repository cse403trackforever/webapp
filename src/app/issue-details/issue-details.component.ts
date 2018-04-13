import { Component, OnInit } from '@angular/core';
import { ImportService } from '../import.service';
import { Issue } from '../issue';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {
  issue: Issue;

  constructor(private importService: ImportService) { }

  ngOnInit() {
    this.getIssue();
  }

  getIssue(): void {
    // TODO remove temporary debug code
    // this just loads the first issue for now
    this.importService.importProject()
      .subscribe(project => this.issue = project.issues[0]);
  }

}
