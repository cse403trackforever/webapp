import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FetchTrackForeverService {
  constructor(private http: HttpClient) { }
}
