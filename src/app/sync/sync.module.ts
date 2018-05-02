import { NgModule } from '@angular/core';
import { SyncService } from './sync.service';

/**
 * This is a service module for fetching projects
 */
@NgModule({
  providers: [SyncService]
})
export class SyncModule { }
