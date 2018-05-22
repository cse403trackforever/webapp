import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})
export class SigninPageComponent {
  faFacebook = faFacebook;
  faGithub = faGithub;
  email;
  password;
  error;

  constructor(public authService: AuthenticationService, private router: Router) { }

  private tryLogin(p: Promise<any>): void {
    p.then(() => this.afterSignIn())
      .catch(err => {
        this.error = true;
      });
  }

  tryFacebookLogin() {
    this.tryLogin(this.authService.facebookSignIn());
  }

  tryGithubLogin() {
    this.tryLogin(this.authService.githubSignIn());
  }

  tryEmailLogin(formData) {
    const value = {
      email: formData.value.email,
      password: formData.value.password
    };
    this.tryLogin(this.authService.emailSignIn(value));
  }

  afterSignIn() {
    this.error = false;
    const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/myprojects';
    this.router.navigate([redirect]);
  }
}
