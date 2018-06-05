import { TestBed, async } from '@angular/core/testing';
import * as localForage from 'localforage';
import { DataService } from './data.service';
import Spy = jasmine.Spy;
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { last, tap } from 'rxjs/internal/operators';

describe('DataService', () => {
  let service: DataService;
  let localForageSpy: Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });

    service = TestBed.get(DataService);
    localForageSpy = spyOn(localForage, 'createInstance');

    const mockInstance: Partial<LocalForage> = {
      setItem<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T> {
        return new Promise<T>((resolve, reject) => resolve(undefined));
      },

      getItem<T>(key: string, callback?: (err: any, value: T) => void): Promise<T> {
        return new Promise<T>((resolve, reject) => resolve(<any> mockTrackforeverProject));
      },

      keys(callback?: (err: any, keys: string[]) => void): Promise<string[]> {
        return new Promise((resolve, reject) => resolve(['Google Code:my-project', 'GitHub:other-project']));
      }
    };
    localForageSpy.and.returnValue(mockInstance);
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('should create one store per user', async(() => {
    const mockProject = mockTrackforeverProject;
    expect(localForageSpy.calls.count()).toBe(0);

    service.addProject(mockProject, 'djdupre')
      .then((key) => expect(key).toEqual(mockProject.id));
    expect(localForageSpy.calls.count()).toBe(1);

    service.addProject(mockProject, 'djdupre');
    expect(localForageSpy.calls.count()).toBe(1);

    service.addProject(mockProject, 'cjteam');
    expect(localForageSpy.calls.count()).toBe(2);
  }));

  it('should get a project', async(() => {
    service.getProject('Google Code:my-project', 'djdupre')
      .then(project => expect(project).toEqual(mockTrackforeverProject));
  }));

  it('should get keys', async(() => {
    service.getKeys('djdupre')
      .then(keys => expect(keys).toEqual(['Google Code:my-project', 'GitHub:other-project']));
  }));

  it('should get projects', async(() => {
    let i = 0;
    service.getProjects('djdupre').pipe(
      tap(projects => {
        if (i === 0) {
          expect(projects).toEqual([]);
        } else if (i === 1) {
          expect(projects).toEqual([mockTrackforeverProject]);
        } else if (i === 2) {
          expect(projects).toEqual([mockTrackforeverProject, mockTrackforeverProject]);
        } else {
          fail();
        }
        i++;
      }),
      last()
    ).subscribe(() => {
      expect(i).toEqual(3);
    });
  }));
});
