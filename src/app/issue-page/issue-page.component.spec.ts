import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { IssuePageComponent } from './issue-page.component';
import { IssueService } from '../issue/issue.service';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { MarkdownPipe } from '../shared/pipes/markdown.pipe';
import { MomentModule } from 'ngx-moment';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { mockUser } from '../shared/models/mock/mock-user';
import { ActivatedRoute } from '@angular/router';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLinkStubDirective } from '../shared/router-link-stub.directive';
import { of } from 'rxjs';

@Component({
  selector: 'app-issue-details',
  template: '',
})
class IssueDetailsStubComponent {
  @Input() issue: TrackForeverIssue;
  @Output() assigned = new EventEmitter<string>();
  @Output() labeled = new EventEmitter<string>();
}

describe('IssuePageComponent', () => {
  let component: IssuePageComponent;
  let fixture: ComponentFixture<IssuePageComponent>;
  let issueServiceSpy: jasmine.SpyObj<IssueService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async(() => {
    const issueSpy = jasmine.createSpyObj('IssueService', ['getProject', 'setIssue']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [
        MomentModule,
        FormsModule,
        FontAwesomeModule,
      ],
      declarations: [
        IssuePageComponent,
        MarkdownPipe,
        RouterLinkStubDirective,
        IssueDetailsStubComponent,
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
                get: name => {
                  if (name === 'projectId') {
                    return 'my-project';
                  } else if (name === 'issueId') {
                    return '123';
                  }
                  console.error('unrecognized route parameter!');
                  return 'please update the test';
                }
              }
            }
          }
        }
      ]
    })
      .compileComponents();

    issueServiceSpy = TestBed.get(IssueService);
    authServiceSpy = TestBed.get(AuthenticationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuePageComponent);
    component = fixture.componentInstance;

    issueServiceSpy.getProject.and.returnValue(of(mockTrackforeverProject));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add comments', fakeAsync(() => {
    authServiceSpy.getUser.and.returnValue(of(mockUser));
    issueServiceSpy.setIssue.and.returnValue(of(''));
    const issue = mockTrackforeverProject.issues.get('123');

    component.addComment('hello, world!', true);

    fixture.detectChanges();
    tick();

    expect(issueServiceSpy.setIssue.calls.count()).toBe(1);
    const updatedIssue: TrackForeverIssue = issueServiceSpy.setIssue.calls.mostRecent().args[0];
    expect(updatedIssue.status).toEqual('closed');

    const numComments = updatedIssue.comments.length;
    expect(numComments).toEqual(issue.comments.length + 1);

    const newComment = updatedIssue.comments[numComments - 1];
    expect(newComment.content).toEqual('hello, world!');
    expect(newComment.commenterName).toEqual('Christine');

    expect(component.isAddingComment).toBeFalsy();
  }));

  it('should remove comments', fakeAsync(() => {
    issueServiceSpy.setIssue.and.returnValue(of(''));
    const issue = mockTrackforeverProject.issues.get('123');

    component.removeComment(0);

    fixture.detectChanges();
    tick();

    expect(issueServiceSpy.setIssue.calls.count()).toBe(1);
    const updatedIssue: TrackForeverIssue = issueServiceSpy.setIssue.calls.mostRecent().args[0];

    expect(updatedIssue.comments.length).toEqual(issue.comments.length - 1);
    expect(updatedIssue.comments[0].commenterName).toEqual('denvercoder9');
  }));
});
