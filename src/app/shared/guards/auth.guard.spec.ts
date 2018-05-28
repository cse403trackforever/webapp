import { TestBed, async } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Router,
          useValue: rSpy
        },
        {
          provide: AuthenticationService,
          useValue: authSpy
        },
      ]
    });

    guard = TestBed.get(AuthGuard);
    routerSpy = TestBed.get(Router);
    authServiceSpy = TestBed.get(AuthenticationService);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect if not logged in', async(() => {
    const redirectUrl = '/redirect_to_here';
    authServiceSpy.isLoggedIn.and.returnValue(of(false));
    routerSpy.navigate.and.callFake(() => {});

    guard.canActivate(null, <RouterStateSnapshot> { url: redirectUrl })
      .subscribe(canActivate => {
        expect(canActivate).toBeFalsy();
        expect(routerSpy.navigate.calls.count()).toEqual(1);
        expect(routerSpy.navigate.calls.mostRecent().args).toEqual([['/signin']]);
        expect(authServiceSpy.redirectUrl).toEqual(redirectUrl);
      });
  }));

  it('should activate if logged in', async(() => {
    authServiceSpy.isLoggedIn.and.returnValue(of(true));

    guard.canActivate(null, null)
      .subscribe(canActivate => expect(canActivate).toBeTruthy());
  }));
});
