import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CreateIssuePageComponent } from './create-issue-page.component';
import { RouterLinkStubDirective } from '../shared/router-link-stub.directive';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { AuthenticationService } from '../authentication/authentication.service';
import { IssueService } from '../issue/issue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { of } from 'rxjs';
import { mockUser } from '../shared/models/mock/mock-user';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { ConvertTrackforeverService } from '../import/import-trackforever/convert-trackforever.service';

@Component({
  selector: 'app-issue-details',
  template: '',
})
class IssueDetailsStubComponent {
  @Input() issue: TrackForeverIssue;
  @Output() assigned = new EventEmitter<string>();
  @Output() labeled = new EventEmitter<string>();
}

describe('CreateIssuePageComponent', () => {
  let component: CreateIssuePageComponent;
  let fixture: ComponentFixture<CreateIssuePageComponent>;
  let issueServiceSpy: jasmine.SpyObj<IssueService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    const issueSpy = jasmine.createSpyObj('IssueService', ['getProject', 'setIssue']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getUser']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        CreateIssuePageComponent,
        RouterLinkStubDirective,
        IssueDetailsStubComponent,
      ],
      imports: [
        FormsModule,
        NgbModule.forRoot(),
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
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'my-project'
              }
            }
          }
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
    issueServiceSpy.getProject.and.returnValue(of(copyProject(mockTrackforeverProject)));
    authServiceSpy.getUser.and.returnValue(of(mockUser));

    fixture = TestBed.createComponent(CreateIssuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', fakeAsync(() => {
    component.issue.summary = 'new issue!';
    issueServiceSpy.setIssue.and.returnValue(of(null));

    component.onSubmit();

    fixture.detectChanges();
    tick();

    expect(issueServiceSpy.setIssue.calls.count()).toBe(1);
    expect(issueServiceSpy.setIssue.calls.mostRecent().args).toEqual([component.issue]);
    expect(component.issue.id).toEqual('124');
  }));

  it('should add a comment', fakeAsync(() => {
    component.issue.summary = 'new issue!';
    component.commentContent = 'comment!';
    issueServiceSpy.setIssue.and.returnValue(of(null));

    component.onSubmit();

    fixture.detectChanges();
    tick();

    expect(component.issue.comments).toEqual([
      {
        commenterName: mockUser.displayName,
        content: component.commentContent
      }
    ]);
  }));

  it('should redirect to the new issue', fakeAsync(() => {
    component.issue.summary = 'new issue!';
    issueServiceSpy.setIssue.and.returnValue(of(null));

    component.onSubmit();

    fixture.detectChanges();
    tick();

    expect(routerSpy.navigate.calls.count()).toEqual(1);
    expect(routerSpy.navigate.calls.mostRecent().args)
      .toEqual([[`/project/${component.project.id}/issue/${component.issue.id}`]]);
  }));

  it('should assign', () => {
    component.assign('djdupre');
    expect(component.issue.assignees).toContain('djdupre');
    component.assign('djdupre');
    expect(component.issue.assignees).not.toContain('djdupre');
  });

  it('should label', () => {
    component.applyLabel('bug');
    expect(component.issue.labels).toContain('bug');
    component.applyLabel('bug');
    expect(component.issue.labels).not.toContain('bug');
  });

  it('should work with non-numeric ids', () => {
    const weirdProject: TrackForeverProject = copyProject(mockTrackforeverProject);
    weirdProject.issues.set('non-numeric id', {
      hash: '',
      prevHash: '',
      id: 'non-numeric id',
      projectId: weirdProject.id,
      status: 'open',
      summary: 'hmmmm',
      labels: [],
      comments: [],
      submitterName: 'djdupre',
      assignees: [],
    });
    expect(component.nextIssueId(weirdProject)).toEqual(NaN);
  });

  it('should default to id 1 for empty projects', () => {
    const emptyProject: TrackForeverProject = copyProject(mockTrackforeverProject);
    emptyProject.issues.clear();
    expect(component.nextIssueId(emptyProject)).toEqual(1);
  });
});

function copyProject(p: TrackForeverProject): TrackForeverProject {
  return ConvertTrackforeverService.fromJson(ConvertTrackforeverService.toJson(p));
}
