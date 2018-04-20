import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-page',
  templateUrl: './import-page.component.html',
  styleUrls: ['./import-page.component.css']
})
export class ImportPageComponent implements OnInit {

  options: String[] = [
    'GitHub',
    'Google Code',
    'JSON',
  ];

  selectedItem = this.options[0];

  constructor() { }

  ngOnInit() {
  }

  onSelect(selection) {
    this.selectedItem = selection;
  }
}
