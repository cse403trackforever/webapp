import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.css']
})
export class PasswordResetPageComponent implements OnInit {
  beforeSubmit: boolean;
  afterSubmit: boolean;
  error: boolean;
  email;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.beforeSubmit = true;
  }

  tryPasswordReset(formdata) {
    const email = formdata.value.email;
    this.authService.resetPassword(email).then( () => {
      this.beforeSubmit = false;
      this.afterSubmit = true;
      this.error = false;
    }).catch((e) => {
      console.log(e);
      this.error = true;
    });
  }
}
