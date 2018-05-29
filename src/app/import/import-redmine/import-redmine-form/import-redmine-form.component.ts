import { Component } from '@angular/core';
import { ConvertService } from '../../convert.service';
import { ImportService } from '../../import.service';
import { ImportComponent } from '../../import.component';
import { FetchRedmineService } from '../fetch-redmine.service';
import { ConvertRedmineService } from '../convert-redmine.service';

@Component({
  selector: 'app-import-redmine',
  templateUrl: './import-redmine-form.component.html',
  styleUrls: ['./import-redmine-form.component.css'],
  providers: [
    ImportService,
    FetchRedmineService,
    {
      provide: ConvertService,
      useClass: ConvertRedmineService
    }
  ]
})
export class ImportRedmineFormComponent extends ImportComponent {
  projectName: string;
  projectID: number;
  serverUrl: string;

  constructor(importService: ImportService) {
    super(importService);
  }

  onSubmit(): void {
    this.importProject({ projectName: this.projectName, projectID: this.projectID, serverUrl: this.serverUrl });
  }
}
