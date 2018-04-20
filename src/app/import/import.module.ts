import { NgModule } from '@angular/core';
import { ImportPageComponent } from './import-page/import-page.component';
import { ImportGithubComponent } from './import-github/import-github.component';
import { CommonModule } from '@angular/common';
import { ImportGithubService } from './import-github.service';
import { FetchGithubService } from './api/fetch-github.service';
import { FormsModule } from '@angular/forms';

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
  ],
  exports: [
    ImportPageComponent
  ],
  providers: [
    ImportGithubService,
    FetchGithubService,
  ]
})
export class ImportModule { }
