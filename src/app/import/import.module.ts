import { NgModule } from '@angular/core';
import { ImportPageComponent } from './import-page/import-page.component';
import { ImportGithubComponent } from './import-github/import-github.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportGoogleCodeComponent } from './import-googlecode/import-googlecode.component';
import { ImportTrackForeverComponent } from './import-trackforever/import-trackforever.component';
import { ImportRedmineComponent } from './import-redmine/import-redmine.component';

/**
 * The ImportModule is a *domain* module declares the import page.
 * Add import components to declarations as they are implemented.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    ImportPageComponent,
    ImportGithubComponent,
    ImportGoogleCodeComponent,
    ImportRedmineComponent,
    ImportTrackForeverComponent
  ],
  exports: [
    ImportPageComponent
  ]
})
export class ImportModule { }
