import { Component, EventEmitter, Output } from '@angular/core';
import { ImportGoogleCodeService } from '../import-googlecode.service';

@Component({
  selector: 'app-import-googlecode',
  templateUrl: './import-googlecode.component.html',
  styleUrls: ['./import-googlecode.component.css']
})
export class ImportGoogleCodeComponent {
  // emits the project ID after importing
  @Output() complete = new EventEmitter<String>();

  ownerName: String;
  projectName: String;

  constructor(private importService: ImportGoogleCodeService) { }

  onSubmit(): void {
    this.importProject(this.projectName);
  }

  importProject(projectName: String): void {
    this.importService.importProject(projectName)
      .subscribe(project => {
        // TODO store the project
        console.log(project);
        this.complete.emit(project.id);
      });
  }
}
