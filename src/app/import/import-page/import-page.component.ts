import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  options: string[] = [
    'GitHub',
    'Google Code',
    'Redmine',
    'JSON',
  ];

  selectedItem = this.options[0];

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
