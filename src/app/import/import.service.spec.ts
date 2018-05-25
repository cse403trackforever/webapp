import { TestBed, async } from '@angular/core/testing';

import { ImportService } from './import.service';
import { ConvertService } from './convert.service';
import { DataService } from '../database/data.service';
import { mockTrackforeverProject } from './models/trackforever/mock/mock-trackforever-project';
import { Observable } from 'rxjs/Observable';

describe('ImportService', () => {
  let service: ImportService;
  let convertServiceSpy: jasmine.SpyObj<ConvertService>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    const convertSpy = jasmine.createSpyObj('ConvertService', ['importProject']);
    const dataSpy = jasmine.createSpyObj('DataService', ['addProject']);

    TestBed.configureTestingModule({
      providers: [
        ImportService,
        {
          provide: ConvertService,
          useValue: convertSpy
        },
        {
          provide: DataService,
          useValue: dataSpy
        },
      ]
    });

    service = TestBed.get(ImportService);
    convertServiceSpy = TestBed.get(ConvertService);
    dataServiceSpy = TestBed.get(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import', async(() => {
    const args = 'my-project';
    const testKey = 'key!';
    const testProject = mockTrackforeverProject;

    convertServiceSpy.importProject.and.returnValue(Observable.of(testProject));
    dataServiceSpy.addProject.and.returnValue(new Promise((resolve) => resolve(testKey)));

    service.importProject(args)
      .then((key) => {
        expect(key).toEqual(testKey);
      });
  }));

  const errorCall = (message): string => {
    throw new Error(message);
  };

  it('should bubble up error message', async(() => {
    const args = 'my-project';
    const errorMsg = 'error!';

    convertServiceSpy.importProject.and.returnValue(Observable.of(errorCall).map(e => e(errorMsg)));

    service.importProject(args)
      .then(() => expect(true).toBeFalsy('should error'))
      .catch((error) => {
        console.log('got here!');
        expect(error).toEqual(errorMsg);
      });
  }));
});
