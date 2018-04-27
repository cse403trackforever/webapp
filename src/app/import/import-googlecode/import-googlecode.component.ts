import { Component } from '@angular/core';
import { ImportGoogleCodeService } from '../import-googlecode.service';
import { ConvertService } from '../convert.service';
import { ImportService } from '../import.service';
import { FetchGoogleCodeService } from '../api/fetch-googlecode.service';
import { ImportComponent } from '../import.component';

@Component({
  selector: 'app-import-googlecode',
  templateUrl: './import-googlecode.component.html',
  styleUrls: ['./import-googlecode.component.css'],
  providers: [
    ImportService,
    FetchGoogleCodeService,
    {
      provide: ConvertService,
      useClass: ImportGoogleCodeService
    }
  ]
})
export class ImportGoogleCodeComponent extends ImportComponent {
  projectName: String;

  constructor(importService: ImportService) {
    super(importService);
  }

  onSubmit(): void {
    this.importProject(this.projectName);
  }
}
