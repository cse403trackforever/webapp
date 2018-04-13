import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from './project';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()
export class ImportService {

  constructor(private http: HttpClient) { }

  importProject(): Observable<Project> {
    return this.http.get<Project>(environment.apiUrl);
  }
}
