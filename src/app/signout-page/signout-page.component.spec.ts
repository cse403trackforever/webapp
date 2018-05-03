import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoutPageComponent } from './signout-page.component';
import { AuthenticationService } from '../authentication.service';

describe('SignoutPageComponent', () => {
  let component: SignoutPageComponent;
  let fixture: ComponentFixture<SignoutPageComponent>;
  let authServiceStub: Partial<AuthenticationService>;

  beforeEach(async(() => {
    // stub auth service
    authServiceStub = {
      logout() { }
    };

    TestBed.configureTestingModule({
      declarations: [ SignoutPageComponent ],
      providers: [{ provide: AuthenticationService, useValue: authServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
