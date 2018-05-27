import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CreateProjectPageComponent } from './create-project-page.component';
import { RouterLinkStubDirective } from '../shared/router-link-stub.directive';
import { FormsModule } from '@angular/forms';
import { IssueService } from '../issue/issue.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { mockUser } from '../shared/models/mock/mock-user';
import { of } from 'rxjs';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';

describe('CreateProjectPageComponent', () => {
  let component: CreateProjectPageComponent;
  let fixture: ComponentFixture<CreateProjectPageComponent>;
  let issueServiceSpy: jasmine.SpyObj<IssueService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    const issueSpy = jasmine.createSpyObj('IssueService', ['setProject']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getUser']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        CreateProjectPageComponent,
        RouterLinkStubDirective,
      ],
      imports: [
        FormsModule,
      ],
      providers: [
        {
          provide: IssueService,
          useValue: issueSpy
        },
        {
          provide: AuthenticationService,
          useValue: authSpy
        },
        {
          provide: Router,
          useValue: rSpy
        },
      ]
    })
    .compileComponents();

    issueServiceSpy = TestBed.get(IssueService);
    authServiceSpy = TestBed.get(AuthenticationService);
    routerSpy = TestBed.get(Router);
  }));

  beforeEach(() => {
    authServiceSpy.getUser.and.returnValue(of(mockUser));
    issueServiceSpy.setProject.and.returnValue(of(null));

    fixture = TestBed.createComponent(CreateProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a project', fakeAsync(() => {
    component.project.name = 'hello world!';
    component.project.description = 'description!';

    component.createProject();

    fixture.detectChanges();
    tick();

    expect(issueServiceSpy.setProject.calls.count()).toBe(1);
    const project: TrackForeverProject = issueServiceSpy.setProject.calls.mostRecent().args[0];
    expect(project.ownerName).toEqual(mockUser.displayName);
    expect(project.id).toEqual('Track Forever:hello world!');
  }));

  it('should navigate', fakeAsync(() => {
    component.project.name = 'hello world!';
    component.project.description = 'description!';

    component.createProject();

    fixture.detectChanges();
    tick();

    expect(routerSpy.navigate.calls.count()).toBe(1);
    expect(routerSpy.navigate.calls.mostRecent().args).toEqual([[`/project/Track Forever:hello world!`]]);
  }));
});
