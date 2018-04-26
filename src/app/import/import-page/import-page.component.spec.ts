import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPageComponent } from './import-page.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';


@Component({selector: 'app-import-github', template: ''})
class ImportGithubStubComponent {}
@Component({selector: 'app-import-googlecode', template: ''})
class ImportGoogleCodeStubComponent {}
@Component({selector: 'app-import-trackforever', template: ''})
class ImportTrackForeverStubComponent {}

describe('ImportPageComponent', () => {
  let component: ImportPageComponent;
  let fixture: ComponentFixture<ImportPageComponent>;

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [
        ImportPageComponent,
        ImportGithubStubComponent,
        ImportGoogleCodeStubComponent,
        ImportTrackForeverStubComponent
      ],
      imports: [ FormsModule ],
      providers: [
        {
          provide: Router,
          useValue: routerSpy
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
