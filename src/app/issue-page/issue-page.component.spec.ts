import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePageComponent } from './issue-page.component';
import { IssueService } from '../issue/issue.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { MarkdownPipe } from '../shared/pipes/markdown.pipe';
import { MomentModule } from 'angular2-moment';

describe('IssuePageComponent', () => {
  let component: IssuePageComponent;
  let fixture: ComponentFixture<IssuePageComponent>;
  let issueServiceSpy: jasmine.SpyObj<IssueService>;

  beforeEach(async(() => {
    const issueSpy = jasmine.createSpyObj('IssueService', ['getProject']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MomentModule,
      ],
      declarations: [ IssuePageComponent, MarkdownPipe ],
      providers: [ {provide: IssueService, useValue: issueSpy}]
    })
    .compileComponents();

    issueServiceSpy = TestBed.get(IssueService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuePageComponent);
    component = fixture.componentInstance;

    issueServiceSpy.getProject.and.returnValue(Observable.of(mockTrackforeverProject));

    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
