import { Component, EventEmitter, Output } from '@angular/core';
import { ImportGithubService } from '../import-github.service';

@Component({
  selector: 'app-import-github',
  templateUrl: './import-github.component.html',
  styleUrls: ['./import-github.component.css']
})
export class ImportGithubComponent {
  // emits the project ID after importing
  @Output() complete = new EventEmitter<String>();

  ownerName: String;
  projectName: String;

  constructor(private importService: ImportGithubService) { }

  onSubmit(): void {
    this.importProject(this.ownerName, this.projectName);
  }

  importProject(ownerName: String, projectName: String): void {
    this.importService.importProject(ownerName, projectName)
      .subscribe(project => {
        // TODO store the project
        console.log(project);
        this.complete.emit(project.id);
      });
  }
}
