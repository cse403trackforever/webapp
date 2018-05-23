import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faMinus, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent {
  @Input() issue: TrackForeverIssue;

  @Output() assigned: EventEmitter<string> = new EventEmitter<string>();
  @Output() labeled: EventEmitter<string> = new EventEmitter<string>();

  assignForm: FormGroup;
  labelForm: FormGroup;

  faMinus = faMinus;
  faPlus = faPlus;
  faTrash = faTrashAlt;

  constructor(private fb: FormBuilder) {
    this.createForms();
  }

  createForms() {
    this.assignForm = this.fb.group({
      text: [''],
    });
    this.labelForm = this.fb.group({
      text: [''],
    });
  }

  assign() {
    const assignee: string = this.assignForm.get('text').value;
    if (assignee === '' || this.issue.assignees.includes(assignee)) {
      return;
    }
    this.assigned.emit(assignee);
    this.assignForm.reset();
  }

  unassign(assignee: string) {
    if (this.issue.assignees.includes(assignee)) {
      this.assigned.emit(assignee);
    }
  }

  applyLabel() {
    const label: string = this.labelForm.get('text').value;
    if (label === '' || this.issue.labels.includes(label)) {
      return;
    }
    this.labeled.emit(label);
    this.labelForm.reset();
  }

  unLabel(label: string) {
    if (this.issue.labels.includes(label)) {
      this.labeled.emit(label);
    }
  }
}
