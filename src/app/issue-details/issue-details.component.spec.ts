import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDetailsComponent } from './issue-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentModule } from 'ngx-moment';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { first } from 'rxjs/operators';

describe('IssueDetailsComponent', () => {
  let component: IssueDetailsComponent;
  let fixture: ComponentFixture<IssueDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueDetailsComponent ],
      imports: [
        ReactiveFormsModule,
        FontAwesomeModule,
        MomentModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailsComponent);
    component = fixture.componentInstance;
    component.issue = mockTrackforeverProject.issues.get('123');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign', () => {
    const a = 'djdupre';

    component.assigned.pipe(first()).subscribe(assignee => {
      expect(assignee).toEqual(a);
    });

    component.assignForm.setValue({ text: a });
    component.assign();
  });

  it('should not assign if already assigned', () => {
    const a = 'denvercoder9';

    component.assigned.subscribe(() => fail());

    component.assignForm.setValue({ text: a });
    component.assign();
  });

  it('should unassign', () => {
    const a = 'denvercoder9';

    component.assigned.pipe(first()).subscribe(assignee => {
      expect(assignee).toEqual(a);
    });

    component.unassign(a);
  });

  it('should label', () => {
    const label = 'enhancement';

    component.labeled.pipe(first()).subscribe(actual => {
      expect(actual).toEqual(label);
    });

    component.labelForm.setValue({ text: label });
    component.applyLabel();
  });

  it('should not label if already labeled', () => {
    const label = 'bug';

    component.labeled.subscribe(() => fail());

    component.labelForm.setValue({ text: label });
    component.applyLabel();
  });

  it('should unLabel', () => {
    const label = 'bug';

    component.labeled.pipe(first()).subscribe(actual => {
      expect(actual).toEqual(label);
    });

    component.unLabel(label);
  });
});
