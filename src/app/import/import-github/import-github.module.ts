import { NgModule } from '@angular/core';
import { ImportGithubFormComponent } from './import-github-form/import-github-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ ImportGithubFormComponent ],
  exports: [ ImportGithubFormComponent ],
  entryComponents: [ ImportGithubFormComponent ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class ImportGithubModule { }
