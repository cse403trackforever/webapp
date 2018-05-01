import { TestBed, inject } from '@angular/core/testing';

import { OfflineIssueService } from './offline-issue.service';
import { DataService } from '../database/data.service';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';

describe('OfflineIssueService', () => {
  let dataServiceStub: Partial<DataService>;

  beforeEach(() => {
    dataServiceStub = {
      getProject(key: string): Promise<TrackForeverProject> {
        return new Promise<TrackForeverProject>(() => mockTrackforeverProject);
      }
    };

    TestBed.configureTestingModule({
      providers: [
        OfflineIssueService,
        {
          provide: DataService,
          useValue: dataServiceStub
        }
      ]
    });
  });

  it('should be created', inject([OfflineIssueService], (service: OfflineIssueService) => {
    expect(service).toBeTruthy();
  }));
});
