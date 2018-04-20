import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGithubComponent } from './import-github.component';

describe('ImportGithubComponent', () => {
  let component: ImportGithubComponent;
  let fixture: ComponentFixture<ImportGithubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportGithubComponent ]
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
