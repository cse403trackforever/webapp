import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPageComponent } from './project-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IssueService } from '../issue/issue.service';
import { Project } from '../shared/models/project';
import { Observable } from 'rxjs/Observable';
import { mockProject } from '../shared/models/mock/mock-project';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent;
  let fixture: ComponentFixture<ProjectPageComponent>;
  let issueServiceStub: Partial<IssueService>;

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getProject(): Observable<Project> {
        return Observable.of(mockProject);
      }
    };

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
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
