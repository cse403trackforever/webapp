import { Component } from '@angular/core';
import { ImportTrackForeverService } from '../import-trackforever.service';
import { ConvertService } from '../../convert.service';
import { ImportService } from '../../import.service';
import { ImportComponent } from '../../import.component';

@Component({
  selector: 'app-import-trackforever',
  templateUrl: './import-trackforever-form.component.html',
  styleUrls: ['./import-trackforever-form.component.css'],
  providers: [
    ImportService,
    {
      provide: ConvertService,
      useClass: ImportTrackForeverService
    }
  ]
})
export class ImportTrackforeverFormComponent extends ImportComponent {
  projectFile: File = null;
  fileText = 'Choose JSON file';

  constructor(importService: ImportService) {
    super(importService);
  }

  handleFileInput(files: FileList) {
    this.projectFile = files.item(0);
    this.fileText = (this.projectFile) ? this.projectFile.name : 'Choose JSON file';
  }

  onSubmit(): void {
    const reader = new FileReader();
    reader.readAsText(this.projectFile);
    reader.onloadend = () => this.importProject(reader.result);
  }
}
