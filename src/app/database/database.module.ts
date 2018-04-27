import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';

@NgModule({
  providers: [ DataService, DbkeyPipe ]
})
export class DatabaseModule { }
