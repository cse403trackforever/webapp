import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthUser } from '../shared/models/auth-user';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  user: AuthUser;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.authService.getUser().subscribe(user => this.user = user);
  }
}
