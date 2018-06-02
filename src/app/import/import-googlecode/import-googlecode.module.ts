import { NgModule } from '@angular/core';
import { ImportGooglecodeFormComponent } from './import-googlecode-form/import-googlecode-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ ImportGooglecodeFormComponent ],
  exports: [ ImportGooglecodeFormComponent ],
  entryComponents: [ ImportGooglecodeFormComponent ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class ImportGooglecodeModule { }
