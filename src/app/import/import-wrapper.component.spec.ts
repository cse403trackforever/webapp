import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportWrapperComponent } from './import-wrapper.component';

describe('ImportWrapperComponent', () => {
  let component: ImportWrapperComponent;
  let fixture: ComponentFixture<ImportWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
