import { SyncService } from './../sync/sync.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsPageComponent } from './my-projects-page.component';
import { RouterLink } from '@angular/router';
import { IssueService } from '../issue/issue.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';

describe('MyProjectsPageComponent', () => {
  let component: MyProjectsPageComponent;
  let fixture: ComponentFixture<MyProjectsPageComponent>;
  let issueServiceStub: Partial<IssueService>;
  let syncServiceStub: Partial<SyncService>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    // stub IssueService for testing
    issueServiceStub = {
      getProjects(): Observable<TrackForeverProject[]> {
        return of([mockTrackforeverProject]);
      }
    };
    syncServiceStub = {
      sync(): Observable<any> {
        return of('done');
      }
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule.forRoot(),
      ],
      declarations: [MyProjectsPageComponent],
      providers: [
        {
          provide: IssueService,
          useValue: issueServiceStub
        },
        {
          provide: RouterLink,
          useValue: routerSpy
        },
        {
          provide: SyncService,
          useValue: syncServiceStub
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
