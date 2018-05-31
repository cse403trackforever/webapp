import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  projects: TrackForeverProject[];
  features = [
    'Import from GitHub, Redmine, and Google Code to track all your projects in the same place.',
    'Track issues without an internet connection. Sign in once and the whole site is cached!',
    'Export projects and issues to a human-readable JSON format.',
    'Filter and search issues by assignee, status, label, and title.',
    'Upload issues and projects to the cloud to be viewed on another device.',
    'Track issues on desktop or mobile.'
  ];

  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    // Redirects the user to the projects page if signed in
    this.authService.isLoggedIn()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.router.navigate(['/myprojects']);
        }
      });
  }
}
