import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProjectPageComponent } from './project-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IssueService } from '../issue/issue.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExportService } from '../export/export.service';
import { MarkdownPipe } from '../shared/pipes/markdown.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { Observable } from 'rxjs/Observable';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent;
  let fixture: ComponentFixture<ProjectPageComponent>;
  let issueServiceSpy: jasmine.SpyObj<IssueService>;
  let exportServiceSpy: jasmine.SpyObj<ExportService>;

  beforeEach(async(() => {
    const issueSpy = jasmine.createSpyObj('IssueService', ['getProject', 'setProject']);
    const exportSpy = jasmine.createSpyObj('ExportService', ['download']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        NgbModule.forRoot(),
        FormsModule,
      ],
      providers: [
        {
          provide: IssueService,
          useValue: issueSpy
        },
        {
          provide: ExportService,
          useValue: exportSpy
        },
      ],
      declarations: [ ProjectPageComponent, MarkdownPipe ],
    })
    .compileComponents();

    issueServiceSpy = TestBed.get(IssueService);
    exportServiceSpy = TestBed.get(ExportService);

    issueServiceSpy.getProject.and.returnValue(Observable.of(mockTrackforeverProject));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get a project', fakeAsync(() => {
    // should be undefined before calling ngOnInit
    expect(component.project).toBeUndefined();

    // call onInit
    fixture.detectChanges();
    tick();

    // should eventually get the project
    expect(component.project).toBe(mockTrackforeverProject);
  }));

  it('should export', async(() => {
    fixture.detectChanges();
    component.export();
    expect(exportServiceSpy.download.calls.mostRecent().args[0]).toEqual(mockTrackforeverProject);
  }));

  it('should toggle label filters', () => {
    fixture.detectChanges();

    expect(component.labels).toEqual(new Set(['bug']));
    expect(component.labelFilters).toEqual(new Set());
    component.toggleLabelFilter('bug');
    expect(component.labelFilters).toEqual(new Set(['bug']));

    component.toggleLabelFilter('bug');
    expect(component.labelFilters).toEqual(new Set());
  });

  it('should use label filters', () => {
    fixture.detectChanges();
    component.toggleLabelFilter('bug');
    expect(component.issuesForCurrentPage.length).toEqual(1);
  });

  it('should edit project', fakeAsync(() => {
    issueServiceSpy.setProject.and.returnValue(Observable.of(null));
    fixture.detectChanges();

    const newName = 'Interesting Project';
    const newDesc = 'description!';
    component.editProject(newName, newDesc);

    fixture.detectChanges();
    tick();

    expect(issueServiceSpy.setProject.calls.count()).toBe(1);
    const passedProject: TrackForeverProject = issueServiceSpy.setProject.calls.mostRecent().args[0];
    expect(passedProject.name).toEqual(newName);
    expect(passedProject.description).toEqual(newDesc);
  }));
});
