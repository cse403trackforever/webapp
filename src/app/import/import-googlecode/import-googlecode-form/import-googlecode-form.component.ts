import { Component } from '@angular/core';
import { ConvertGooglecodeService } from '../convert-googlecode.service';
import { ConvertService } from '../../convert.service';
import { ImportService } from '../../import.service';
import { FetchGoogleCodeService } from '../fetch-googlecode.service';
import { ImportComponent } from '../../import.component';

@Component({
  selector: 'app-import-googlecode',
  templateUrl: './import-googlecode-form.component.html',
  styleUrls: ['./import-googlecode-form.component.css'],
  providers: [
    ImportService,
    FetchGoogleCodeService,
    {
      provide: ConvertService,
      useClass: ConvertGooglecodeService
    }
  ]
})
export class ImportGooglecodeFormComponent extends ImportComponent {
  projectName: string;
  useRandom = true;

  constructor(importService: ImportService) {
    super(importService);
  }

  onSubmit(): void {
    this.importProject({ projectName: this.projectName, useRandomNames: this.useRandom });
  }
}
