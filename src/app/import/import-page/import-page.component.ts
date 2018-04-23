import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSelect(selection) {
    this.selectedItem = selection;
  }

  onComplete(id: String) {
    this.router.navigateByUrl(`project/${id}`);
  }
}
