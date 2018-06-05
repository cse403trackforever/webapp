import { TestBed, async } from '@angular/core/testing';

import { FetchRedmineService } from './fetch-redmine.service';
import { ConvertRedmineService } from './convert-redmine.service';
import { mockRedmineProject } from './models/mock/mock-redmine-project';
import { mockRedmineIssueArray } from './models/mock/mock-redmine-issueArray';
import { mockRedmineTrackForeverProject } from './models/mock/mock-redmine-trackforever-project';
import { of } from 'rxjs';
import { RedmineIssueArray } from './models/redmine-issueArray';

describe('ConvertRedmineService', () => {
  let service: ConvertRedmineService;
  let fetchServiceSpy: jasmine.SpyObj<FetchRedmineService>;

  beforeEach(() => {
    const fetchSpy = jasmine.createSpyObj('FetchRedmineService', ['fetchProject', 'fetchIssues', 'fetchIssue']);

    TestBed.configureTestingModule({
      providers: [
        ConvertRedmineService,
        {
          provide: FetchRedmineService,
          useValue: fetchSpy
        }
      ],
    });

    service = TestBed.get(ConvertRedmineService);
    fetchServiceSpy = TestBed.get(FetchRedmineService);

    fetchServiceSpy.fetchProject.and.returnValue(of(mockRedmineProject));
    fetchServiceSpy.fetchIssues.and.returnValue(of(mockRedmineIssueArray));
    fetchServiceSpy.fetchIssue.and.returnValues(of(mockRedmineIssueArray.issues[0]), of(mockRedmineIssueArray.issues[1]));
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('should not crash', async(() => {
    service.importProject({ projectName: '', serverUrl: '' });
  }));

  it('should be correct', async(() => {
    service.importProject({ projectName: '', serverUrl: '' })
      .subscribe(r => {
        expect(r).toEqual(mockRedmineTrackForeverProject);
      });
  }));

  it('should handle multiple pages', async(() => {
    const page1: RedmineIssueArray = {
      issues: mockRedmineIssueArray.issues,
      total_count: 102,
      offset: 0,
      limit: 100
    };

    // set the other page to have the same issues but with the ID incremented
    const otherIssues = JSON.parse(JSON.stringify(page1.issues));
    otherIssues[0].id = 6;
    otherIssues[1].id = 124;
    const page2: RedmineIssueArray = {
      issues: otherIssues,
      total_count: 102,
      offset: 100,
      limit: 100
    };

    // create an expected map of those issues
    const expectedIssues = new Map();
    mockRedmineTrackForeverProject.issues.forEach((val, key) => {
      expectedIssues.set(key, val);
      expectedIssues.set((+key) + 1, val);
    });

    // return the next page on each call to fetchIssues
    let i = 0;
    const pages = [page1, page2];
    fetchServiceSpy.fetchIssues.and.callFake(() => of(pages[i++]));
    fetchServiceSpy.fetchIssue.and.returnValues(of(page1.issues[0]), of(page1.issues[1]), of(page2.issues[0]), of(page2.issues[1]));

    service.importProject({ projectName: '', serverUrl: '' })
      .subscribe(r => {
        expect(fetchServiceSpy.fetchIssues.calls.count()).toBe(2);
        expect(r.issues.size).toEqual(expectedIssues.size);
        expectedIssues.forEach(issue => {
          expect(r.issues.has(issue.id)).toBeTruthy();
          expect(r.issues.get(issue.id)).toEqual(issue);
        });
      });
  }));
});
