import { EventEmitter, Output } from '@angular/core';
import { ImportService } from './import.service';

export abstract class ImportComponent {
  // Emits the project ID after importing
  @Output() complete = new EventEmitter<String>();
  // Gives a user readable error message on failure
  @Output() error = new EventEmitter<String>();
  // Signals that the import has begun
  @Output() working = new EventEmitter<Boolean>();

  protected constructor(private importService: ImportService) { }

  protected importProject(args: any): void {
    this.working.emit(true);
    this.importService.importProject(args)
      .catch(error => this.error.emit(error))
      .then(key => (key) ? this.complete.emit(key) : null);
  }
}
