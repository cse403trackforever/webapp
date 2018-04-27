import { EventEmitter, Output } from '@angular/core';
import { ImportService } from './import.service';

export abstract class ImportComponent {
  // emits the project ID after importing
  @Output() complete = new EventEmitter<String>();

  protected constructor(private importService: ImportService) { }

  protected importProject(args: any): void {
    this.importService.importProject(args).then(key => this.complete.emit(key));
  }
}
