import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetPageComponent } from './password-reset-page.component';
import { AuthenticationService } from '../authentication/authentication.service';
import { FormsModule } from '@angular/forms';

describe('PasswordResetPageComponent', () => {
  let component: PasswordResetPageComponent;
  let fixture: ComponentFixture<PasswordResetPageComponent>;
  let authServiceStub: Partial<AuthenticationService>;

  beforeEach(async(() => {
    authServiceStub = {
      resetPassword(email): any { }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PasswordResetPageComponent],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceStub
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
