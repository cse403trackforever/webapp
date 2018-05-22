import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {
  email;
  password;
  error: boolean;
  errorMessage = '';

  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  trySignUp(formData) {
    const value = {
      email: formData.value.email,
      password: formData.value.password
    };

    this.authService.register(value).then(() => {
      const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/myprojects';
      this.router.navigate([redirect]);
    }).catch((e) => {
      this.error = true;
      this.errorMessage = e.message;
    });
  }
}
