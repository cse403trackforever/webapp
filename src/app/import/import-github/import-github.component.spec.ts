import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGithubComponent } from './import-github.component';
import { FormsModule } from '@angular/forms';
import { ImportGithubService } from '../import-github.service';
import { TrackForeverProject } from '../models/trackforever/trackforever-project';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { mockTrackforeverProject } from '../models/trackforever/mock/mock-trackforever-project';

describe('ImportGithubComponent', () => {
  let component: ImportGithubComponent;
  let fixture: ComponentFixture<ImportGithubComponent>;
  let importServiceStub: Partial<ImportGithubService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(ownerName: String, projectName: String): Observable<TrackForeverProject> {
        return Observable.of(mockTrackforeverProject);
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportGithubComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: ImportGithubService,
          useValue: importServiceStub
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportGithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
