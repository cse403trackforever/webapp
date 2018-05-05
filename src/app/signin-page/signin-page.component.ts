import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})
export class SigninPageComponent implements OnInit {
  faFacebook = faFacebook;
  faGithub = faGithub;

  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    // If the user is already logged in, redirects to home
    this.authService.getUser()
      .subscribe(user => {
        if (user) {
          console.log('signin page - user is signed in');
          this.router.navigate(['/myprojects']);
        } else {
          console.log('signin page - user is not signed in');
        }
      });
  }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
    .then(res => {
      this.router.navigate(['/myprojects']);
    }, err => console.log(err)
    );
  }

  tryGithubLogin() {
    this.authService.doGithubLogin()
    .then(res => {
      this.router.navigate(['/myprojects']);
    }, err => console.log(err)
    );
  }
}
