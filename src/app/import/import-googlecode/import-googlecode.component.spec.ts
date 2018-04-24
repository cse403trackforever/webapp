import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportGoogleCodeComponent } from './import-googlecode.component';

describe('ImportGithubComponent', () => {
  let component: ImportGoogleCodeComponent;
  let fixture: ComponentFixture<ImportGoogleCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportGoogleCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportGoogleCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
