import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIssuePageComponent } from './create-issue-page.component';

describe('CreateIssuePageComponent', () => {
  let component: CreateIssuePageComponent;
  let fixture: ComponentFixture<CreateIssuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIssuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIssuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
