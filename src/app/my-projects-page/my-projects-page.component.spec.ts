import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsPageComponent } from './my-projects-page.component';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';
import { RouterLink } from '@angular/router';
import { IssueService } from '../issue/issue.service';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';

describe('MyProjectsPageComponent', () => {
  let component: MyProjectsPageComponent;
  let fixture: ComponentFixture<MyProjectsPageComponent>;
  let issueServiceStub: Partial<IssueService>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getProjects(): Observable<TrackForeverProject[]> {
        return Observable.of([mockTrackforeverProject]);
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
