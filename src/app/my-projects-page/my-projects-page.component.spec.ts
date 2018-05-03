import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsPageComponent } from './my-projects-page.component';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';
import { RouterLink } from '@angular/router';
import { IssueService } from '../issue/issue.service';
import { Observable } from 'rxjs/Observable';
import { ProjectSummary } from '../shared/models/project-summary';
import { mockProjectSummary } from '../shared/models/mock/mock-project-summary';
import { RouterTestingModule } from '@angular/router/testing';

describe('MyProjectsPageComponent', () => {
  let component: MyProjectsPageComponent;
  let fixture: ComponentFixture<MyProjectsPageComponent>;
  let issueServiceStub: Partial<IssueService>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getProjects(): Observable<ProjectSummary[]> {
        return Observable.of([mockProjectSummary]);
      }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MyProjectsPageComponent, DbkeyPipe],
      providers: [
        {
          provide: IssueService,
          useValue: issueServiceStub
        },
        {
          provide: RouterLink,
          useValue: routerSpy
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
