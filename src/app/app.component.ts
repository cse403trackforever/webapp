import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from './shared/models/auth-user';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { AuthenticationService } from './authentication/authentication.service';
import { CorsProxyService } from './cors-proxy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  user: AuthUser;
  collapsed = true;
  faClock = faClock;

  constructor(public authService: AuthenticationService,
              private corsProxy: CorsProxyService,
              private router: Router) { }

  ngOnInit(): void {
    this.authService.getUser()
      .subscribe(user => {
        this.user = user;
      });
    this.corsProxy.init();
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  signOut(): void {
    this.user = undefined;
    this.authService.signOut();
    this.router.navigate(['/home']);
  }
}
