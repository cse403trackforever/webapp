import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-signout-page',
  templateUrl: './signout-page.component.html',
  styleUrls: ['./signout-page.component.css']
})
export class SignoutPageComponent implements OnInit {

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.logout();
  }
}
