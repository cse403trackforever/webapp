import { NgModule } from '@angular/core';
import { ImportTrackforeverFormComponent } from './import-trackforever-form/import-trackforever-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ ImportTrackforeverFormComponent ],
  exports: [ ImportTrackforeverFormComponent ],
  entryComponents: [ ImportTrackforeverFormComponent ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class ImportTrackforeverModule { }
