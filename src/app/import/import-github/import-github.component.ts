import { Component } from '@angular/core';
import { ImportGithubService } from '../import-github.service';

@Component({
  selector: 'app-import-github',
  templateUrl: './import-github.component.html',
  styleUrls: ['./import-github.component.css']
})
export class ImportGithubComponent {

  constructor(private importService: ImportGithubService) { }

  importProject(ownerName: String, projectName: String): void {
    this.importService.importProject(ownerName, projectName)
      .subscribe(project => {
        // TODO store the project
      });
  }
}
