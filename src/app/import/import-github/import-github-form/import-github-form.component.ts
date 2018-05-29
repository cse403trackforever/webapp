import { Component } from '@angular/core';
import { ImportComponent } from '../../import.component';
import { ImportService } from '../../import.service';
import { ConvertService } from '../../convert.service';
import { ConvertGithubService } from '../convert-github.service';
import { FetchGithubService } from '../fetch-github.service';

@Component({
  selector: 'app-import-github',
  templateUrl: './import-github-form.component.html',
  styleUrls: ['./import-github-form.component.css'],
  providers: [
    ImportService,
    FetchGithubService,
    {
      provide: ConvertService,
      useClass: ConvertGithubService
    }
  ]
})
export class ImportGithubFormComponent extends ImportComponent {
  ownerName: string;
  projectName: string;

  constructor(importService: ImportService) {
    super(importService);
  }

  onSubmit(): void {
    this.importProject(this.ownerName, this.projectName);
  }
}
