import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import { environment } from '../environments/environment';
import { mockTrackforeverProject } from './import/models/trackforever/mock/mock-trackforever-project';

/**
 * This interceptor lets us mock the backend while it's still in development.
 * NOT for unit testing! (use https://angular.io/guide/http#testing-http-requests instead)
 */
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.of(null).mergeMap(() => {
      if (request.url.startsWith(environment.apiUrl)) {
        // mock getIssues
        if (request.url.endsWith('/issues')) {
          return Observable.of(new HttpResponse({
            status: 200,
            body: mockTrackforeverProject.issues[0]
          }));
        }

        // mock getProjects
        if (request.url.endsWith('/projects')) {
          return Observable.of(new HttpResponse({
            status: 200,
            body: [mockTrackforeverProject]
          }));
        }

        // mock getProject
        if (request.url.match(/\/projects\/[^\/]*$/)) {
          return Observable.of(new HttpResponse({
            status: 200,
            body: mockTrackforeverProject
          }));
        }
      }

      // pass through
      return next.handle(request);
    })

    // ensures delay
      .materialize()
      .delay(500)
      .dematerialize();
  }
}
