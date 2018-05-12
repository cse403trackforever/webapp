import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPageComponent } from './project-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IssueService } from '../issue/issue.service';
import { Observable } from 'rxjs/Observable';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { ExportService } from '../export/export.service';
import { MarkdownPipe } from '../shared/pipes/markdown.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent;
  let fixture: ComponentFixture<ProjectPageComponent>;
  let issueServiceStub: Partial<IssueService>;
  let exportServiceStub: Partial<ExportService>;

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getProject(): Observable<TrackForeverProject> {
        return Observable.of(mockTrackforeverProject);
      }
    };

    exportServiceStub = {
      download(): void { }
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        NgbModule.forRoot(),
      ],
      providers: [
        {
          provide: IssueService,
          useValue: issueServiceStub
        },
        {
          provide: ExportService,
          useValue: exportServiceStub
        },
      ],
      declarations: [ ProjectPageComponent, DbkeyPipe, MarkdownPipe ],
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
