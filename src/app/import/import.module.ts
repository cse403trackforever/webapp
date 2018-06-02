import { NgModule } from '@angular/core';
import { ImportPageComponent } from './import-page/import-page.component';
import { ImportGooglecodeModule } from './import-googlecode/import-googlecode.module';
import { ImportGithubModule } from './import-github/import-github.module';
import { ImportRedmineModule } from './import-redmine/import-redmine.module';
import { ImportTrackforeverModule } from './import-trackforever/import-trackforever.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportWrapperComponent } from './import-wrapper.component';

/**
 * The ImportModule is a domain module that declares the import page.
 * Add tracker-specific modules as they are implemented.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImportGithubModule,
    ImportGooglecodeModule,
    ImportRedmineModule,
    ImportTrackforeverModule,
  ],
  declarations: [
    ImportPageComponent,
    ImportWrapperComponent,
  ],
  exports: [
    ImportPageComponent
  ]
})
export class ImportModule { }
