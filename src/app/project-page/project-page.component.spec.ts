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

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent;
  let fixture: ComponentFixture<ProjectPageComponent>;
  let issueServiceSpy: jasmine.SpyObj<IssueService>;
  let exportServiceSpy: jasmine.SpyObj<ExportService>;

  beforeEach(async(() => {
    const issueSpy = jasmine.createSpyObj('IssueService', ['getProject']);
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
});
