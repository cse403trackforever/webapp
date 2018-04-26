import { Component, EventEmitter, Output } from '@angular/core';
import { ImportTrackForeverService } from '../import-trackforever.service';

@Component({
  selector: 'app-import-trackforever',
  templateUrl: './import-trackforever.component.html',
  styleUrls: ['./import-trackforever.component.css']
})
export class ImportTrackForeverComponent {
  // emits the project ID after importing
  @Output() complete = new EventEmitter<String>();

  projectFile: File = null;

  constructor(private importService: ImportTrackForeverService) { }

  handleFileInput(files: FileList) {
    this.projectFile = files.item(0);
  }

  onSubmit(): void {
    const reader = new FileReader();
    reader.readAsText(this.projectFile);
    reader.onloadend = () => this.importProject(reader.result);
  }

  importProject(projectFile: String): void {
    console.log(projectFile);
    this.importService.importProject(projectFile)
      .subscribe(project => {
        // TODO store the project
        console.log(project);
        this.complete.emit(project.id);
      });
  }
}
