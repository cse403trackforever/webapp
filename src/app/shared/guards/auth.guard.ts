import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * A guard to prevent unauthenticated users from accessing certain pages
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(map(loggedIn => {
      if (!loggedIn) {
        /*
         Unauthenticated users are automatically redirected to the signin page. The requested url is stored so that the user can be
         redirected to it after they sign in successfully.
          */
        this.authService.redirectUrl = state.url;
        this.router.navigate(['/signin']);
      }

      return loggedIn;
    }));
  }
}
