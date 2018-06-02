import { NgModule } from '@angular/core';
import { ImportRedmineFormComponent } from './import-redmine-form/import-redmine-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ ImportRedmineFormComponent ],
  exports: [ ImportRedmineFormComponent ],
  entryComponents: [ ImportRedmineFormComponent ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class ImportRedmineModule { }
