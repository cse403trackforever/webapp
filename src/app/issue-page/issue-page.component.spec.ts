import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePageComponent } from './issue-page.component';
import { IssueService } from '../issue/issue.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { MarkdownPipe } from '../shared/pipes/markdown.pipe';

describe('IssuePageComponent', () => {
  let component: IssuePageComponent;
  let fixture: ComponentFixture<IssuePageComponent>;
  let issueServiceStub: Partial<IssueService>;

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getIssue(): Observable<TrackForeverIssue> {
        return Observable.of(mockTrackforeverProject.issues[0]);
      }
    };

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ IssuePageComponent, MarkdownPipe ],
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
