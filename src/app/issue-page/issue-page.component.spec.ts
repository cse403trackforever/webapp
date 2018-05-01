import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePageComponent } from './issue-page.component';
import { IssueService } from '../issue/issue.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Issue } from '../shared/models/issue';
import { mockIssue } from '../shared/models/mock/mock-issue';
import { RouterTestingModule } from '@angular/router/testing';

describe('IssuePageComponent', () => {
  let component: IssuePageComponent;
  let fixture: ComponentFixture<IssuePageComponent>;
  let issueServiceStub: Partial<IssueService>;

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getIssue(): Observable<Issue> {
        return Observable.of(mockIssue);
      }
    };

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ IssuePageComponent ],
      providers: [ {provide: IssueService, useValue: issueServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
