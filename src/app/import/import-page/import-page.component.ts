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

  options: String[] = [
    'GitHub',
    'Google Code',
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
   * Handle error by displaying an error box
   * @param message error message to display
   */
  onError(message: String) {
    this.errorMessage = message.toString();
  }

  onComplete(id: String) {
    // Hide error message
    this.errorMessage = '';
    this.router.navigateByUrl(`project/${id}`);
  }
}
