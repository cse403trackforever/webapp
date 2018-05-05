import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPageComponent } from './project-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IssueService } from '../issue/issue.service';
import { Observable } from 'rxjs/Observable';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent;
  let fixture: ComponentFixture<ProjectPageComponent>;
  let issueServiceStub: Partial<IssueService>;

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getProject(): Observable<TrackForeverProject> {
        return Observable.of(mockTrackforeverProject);
      }
    };

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, FontAwesomeModule ],
      providers: [
        {
          provide: IssueService,
          useValue: issueServiceStub
        }
      ],
      declarations: [ ProjectPageComponent, DbkeyPipe ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
