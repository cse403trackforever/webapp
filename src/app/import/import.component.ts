import { EventEmitter, Output } from '@angular/core';
import { ImportService } from './import.service';

/**
 * A Component to interface with an import service
 */
export abstract class ImportComponent {
  // Emits the project ID after importing
  @Output() complete = new EventEmitter<string>();
  // Gives a user readable error message on failure
  @Output() error = new EventEmitter<string>();
  // Signals that the import has begun
  @Output() working = new EventEmitter<boolean>();

  protected constructor(private importService: ImportService) { }

  /**
   * Import a project and set component outputs based on how it performs
   *
   * @param args the arguments to be passed into the import service
   */
  protected importProject(args: any): void {
    this.working.emit(true);
    this.importService.importProject(args)
      .catch(error => this.error.emit(error))
      .then(key => (key) ? this.complete.emit(key) : null);
  }
}
