import { Component, OnInit } from '@angular/core';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  projects: TrackForeverProject[];
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
