import { TestBed, async } from '@angular/core/testing';

import { ImportService } from './import.service';
import { ConvertService } from './convert.service';
import { DataService } from '../database/data.service';
import { mockTrackforeverProject } from './models/trackforever/mock/mock-trackforever-project';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { mockUser } from '../shared/models/mock/mock-user';

describe('ImportService', () => {
  let service: ImportService;
  let convertServiceSpy: jasmine.SpyObj<ConvertService>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    const convertSpy = jasmine.createSpyObj('ConvertService', ['importProject']);
    const dataSpy = jasmine.createSpyObj('DataService', ['addProject']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getUser']);

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
        {
          provide: AuthenticationService,
          useValue: authSpy
        }
      ]
    });

    service = TestBed.get(ImportService);
    convertServiceSpy = TestBed.get(ConvertService);
    dataServiceSpy = TestBed.get(DataService);
    authServiceSpy = TestBed.get(AuthenticationService);

    authServiceSpy.getUser.and.returnValue(of(mockUser));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import', async(() => {
    const args = 'my-project';
    const testKey = 'key!';
    const testProject = mockTrackforeverProject;

    convertServiceSpy.importProject.and.returnValue(of(testProject));
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

    convertServiceSpy.importProject.and.returnValue(of(errorCall).pipe(map(e => e(errorMsg))));

    service.importProject(args)
      .then(() => expect(true).toBeFalsy('should error'))
      .catch((error) => {
        expect(error).toEqual(errorMsg);
      });
  }));
});
