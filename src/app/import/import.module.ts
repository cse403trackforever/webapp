import { NgModule } from '@angular/core';
import { ImportGithubService } from './import-github.service';

/**
 * The ImportModule is a *service* module that provides all import services.
 * Add import services to the providers list as they are implemented.
 * Do not add declarations or exports.
 */
@NgModule({
  providers: [
    ImportGithubService
  ]
})
export class ImportModule { }
