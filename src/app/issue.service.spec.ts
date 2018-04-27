import { TestBed, inject } from '@angular/core/testing';

import { IssueService } from './issue.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from './database/data.service';
import { TrackForeverProject } from './import/models/trackforever/trackforever-project';
import { mockTrackforeverProject } from './import/models/trackforever/mock/mock-trackforever-project';

describe('IssueService', () => {
  let dataServiceStub: Partial<DataService>;

  beforeEach(() => {
    dataServiceStub = {
      getProject(key: string): Promise<TrackForeverProject> {
        return new Promise<TrackForeverProject>(() => mockTrackforeverProject);
      }
    };

    TestBed.configureTestingModule({
      providers: [
        IssueService,
        {
          provide: DataService,
          useValue: dataServiceStub
        }
      ],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([IssueService], (service: IssueService) => {
    expect(service).toBeTruthy();
  }));
});
