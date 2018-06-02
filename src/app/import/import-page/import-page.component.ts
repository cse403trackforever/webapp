import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImportGithubFormComponent } from '../import-github/import-github-form/import-github-form.component';
import { ImportGooglecodeFormComponent } from '../import-googlecode/import-googlecode-form/import-googlecode-form.component';
import { ImportRedmineFormComponent } from '../import-redmine/import-redmine-form/import-redmine-form.component';
import { ImportTrackforeverFormComponent } from '../import-trackforever/import-trackforever-form/import-trackforever-form.component';
import { ImportComponent } from '../import.component';

interface ImportOption {
  name: string;
  comp: typeof ImportComponent;
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

  selectedItem: ImportOption;
  compOptions: ImportOption[] = [
    { name: 'GitHub', comp: ImportGithubFormComponent },
    { name: 'Google Code', comp: ImportGooglecodeFormComponent },
    { name: 'Redmine', comp: ImportRedmineFormComponent },
    { name: 'JSON', comp: ImportTrackforeverFormComponent },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.selectedItem = this.compOptions[0];
  }

  onSelect() {
    // Hide error message
    this.errorMessage = '';
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
