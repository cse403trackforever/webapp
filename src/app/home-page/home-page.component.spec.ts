import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IssueService } from '../issue.service';
import { ProjectSummary } from '../shared/models/project-summary';
import { Observable } from 'rxjs/Observable';
import { mockProjectSummary } from '../shared/models/mock/mock-project-summary';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let issueServiceStub: Partial<IssueService>;

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getProjects(): Observable<ProjectSummary[]> {
        return Observable.of([mockProjectSummary]);
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
      declarations: [ HomePageComponent, DbkeyPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
