import { Component } from '@angular/core';
import { ImportTrackForeverService } from '../import-trackforever.service';
import { ConvertService } from '../convert.service';
import { ImportService } from '../import.service';
import { ImportComponent } from '../import.component';

@Component({
  selector: 'app-import-trackforever',
  templateUrl: './import-trackforever.component.html',
  styleUrls: ['./import-trackforever.component.css'],
  providers: [
    ImportService,
    {
      provide: ConvertService,
      useClass: ImportTrackForeverService
    }
  ]
})
export class ImportTrackForeverComponent extends ImportComponent {
  projectFile: File = null;

  constructor(importService: ImportService) {
    super(importService);
  }

  handleFileInput(files: FileList) {
    this.projectFile = files.item(0);
  }

  onSubmit(): void {
    const reader = new FileReader();
    reader.readAsText(this.projectFile);
    reader.onloadend = () => this.importProject(reader.result);
  }
}
