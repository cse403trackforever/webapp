import { AuthenticationService } from './../authentication/authentication.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpPageComponent } from './sign-up-page.component';
import { mockUser } from '../shared/models/mock/mock-user';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('SignUpPageComponent', () => {
  let component: SignUpPageComponent;
  let fixture: ComponentFixture<SignUpPageComponent>;
  let authServiceStub: Partial<AuthenticationService>;
  let routerSpy;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceStub = {
      register(value): any {
        return new Promise((resolve) => resolve(mockUser));
      }
    };

    TestBed.configureTestingModule({
      declarations: [SignUpPageComponent],
      imports: [ FormsModule ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceStub
        },
        {
          provide: Router,
          useValue: routerSpy
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
