import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninPageComponent } from './signin-page.component';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../shared/models/user';
import { mockUser } from '../shared/models/mock/mock-user';
import { Router } from '@angular/router';

describe('SigninPageComponent', () => {
  let component: SigninPageComponent;
  let fixture: ComponentFixture<SigninPageComponent>;
  let authServiceStub: Partial<AuthenticationService>;

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // stub auth service
    authServiceStub = {
      getUser(): Observable<User> {
        return Observable.of(mockUser);
      }
    };

    TestBed.configureTestingModule({
      declarations: [SigninPageComponent],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceStub
        },
        {
          provide: Router,
          useValue: routerSpy
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
