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
  email;
  password;

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
    this.authService.facebookSignIn()
      .then(res => {
        this.afterSignIn();
      }, err => console.log(err)
      );
  }

  tryGithubLogin() {
    this.authService.githubSignIn()
      .then(res => {
        this.afterSignIn();
      }, err => console.log(err)
      );
  }

  tryEmailLogin(formData) {
    const value = {
      email: formData.value.email,
      password: formData.value.password
    };
    this.authService.emailSignIn(value)
      .then(res => {
        this.afterSignIn();
      }, err => console.log(err)
      );
  }

  afterSignIn() {
    // TODO perform any after sign in steps needed here
    this.router.navigate(['/myprojects']);
  }
}
