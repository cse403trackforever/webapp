import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDetailsComponent } from './issue-details.component';
import { IssueService } from '../issue.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Issue } from '../shared/models/issue';
import { mockIssue } from '../shared/models/mock/mock-issue';

describe('IssueDetailsComponent', () => {
  let component: IssueDetailsComponent;
  let fixture: ComponentFixture<IssueDetailsComponent>;
  let issueServiceStub: Partial<IssueService>;

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getIssue(): Observable<Issue> {
        return Observable.of(mockIssue);
      }
    };

    TestBed.configureTestingModule({
      declarations: [ IssueDetailsComponent ],
      providers: [ {provide: IssueService, useValue: issueServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
