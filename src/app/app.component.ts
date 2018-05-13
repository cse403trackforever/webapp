import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { User } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  user: User;
  url: string;
  title = 'Track Forever';
  collapsed = true;

  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

    this.authService.getUser()
      .subscribe(user => {
        this.user = user;
        const url = this.router.routerState.snapshot.url;

        // redirects the user as necessary
        if (user && url === '/home') {
          this.router.navigate(['/myprojects']);
        } else if (!user && url !== '/home' && url !== '/signin' && url !== '/signout') {

          this.router.navigate(['/signin']);
        }
      });
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/home']);
  }
}
