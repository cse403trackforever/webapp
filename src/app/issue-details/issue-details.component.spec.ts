import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDetailsComponent } from './issue-details.component';
import { ImportService } from '../import.service';
import { Project } from '../project';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as mockProject from '../../assets/mockProject.json';

describe('IssueDetailsComponent', () => {
  let component: IssueDetailsComponent;
  let fixture: ComponentFixture<IssueDetailsComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    // stub ImportService for testing
    importServiceStub = {
      importProject(): Observable<Project> {
        return Observable.of<any>(mockProject);
      }
    };

    TestBed.configureTestingModule({
      declarations: [ IssueDetailsComponent ],
      providers: [ {provide: ImportService, useValue: importServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
