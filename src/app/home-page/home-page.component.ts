import { Component, OnInit } from '@angular/core';
import { ProjectSummary } from '../shared/models/project-summary';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  projects: ProjectSummary[];
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faSort = faSort;

  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    // Redirects the user to the signin page if not signed in
    this.authService.getUser()
      .subscribe(user => {
        if (user) {
          this.router.navigate(['/myprojects']);
        }
      });
  }
}
