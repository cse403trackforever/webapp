import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Available importers and name to display
enum ImportOptions {
  GitHub = 'GitHub',
  GoogleCode = 'Google Code',
  Redmine = 'Redmine',
  JSON = 'JSON',
}

/**
 * A component to handle importing projects from various sources
 */
@Component({
  selector: 'app-import-page',
  templateUrl: './import-page.component.html',
  styleUrls: ['./import-page.component.css']
})
export class ImportPageComponent implements OnInit {
  title = 'Import';
  // Error message to be displayed. Message will display when this value is Truthy.
  errorMessage = '';
  working = false;
  options = ImportOptions;
  textOptions = Object.keys(this.options).map(e => this.options[e]);

  selectedItem = ImportOptions.GitHub;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSelect(selection) {
    // Hide error message
    this.errorMessage = '';
    this.selectedItem = selection;
  }

  /**
   * Signal to the user that the import is in progress
   * @param working whether progress is being made
   */
  onWorking(working: boolean) {
    this.working = working.valueOf();
  }

  /**
   * Handle error by displaying an error box
   * @param message error message to display
   */
  onError(message: string) {
    this.errorMessage = message;
    this.working = false;
  }

  /**
   * Complete the import and show newly imported project
   * @param id id of the newly imported project
   */
  onComplete(id: string) {
    this.router.navigateByUrl(`project/${id}`);
  }
}
