import { Component } from '@angular/core';
import { ImportComponent } from '../import.component';
import { ImportService } from '../import.service';
import { ConvertService } from '../convert.service';
import { ImportGithubService } from '../import-github.service';
import { FetchGithubService } from '../api/fetch-github.service';

@Component({
  selector: 'app-import-github',
  templateUrl: './import-github.component.html',
  styleUrls: ['./import-github.component.css'],
  providers: [
    ImportService,
    FetchGithubService,
    {
      provide: ConvertService,
      useClass: ImportGithubService
    }
  ]
})
export class ImportGithubComponent extends ImportComponent {
  ownerName: string;
  projectName: string;

  constructor(importService: ImportService) {
    super(importService);
  }

  onSubmit(): void {
    this.importProject({
      ownerName: this.ownerName,
      projectName: this.projectName
    });
  }
}
