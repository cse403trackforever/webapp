import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import { mockIssue } from './shared/models/mock/mock-issue';
import { mockProjectSummary } from './shared/models/mock/mock-project-summary';
import { mockProject } from './shared/models/mock/mock-project';
import { environment } from '../environments/environment';

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
            body: mockIssue
          }));
        }

        // mock getProjects
        if (request.url.endsWith('/projects')) {
          return Observable.of(new HttpResponse({
            status: 200,
            body: [mockProjectSummary]
          }));
        }

        // mock getProject
        if (request.url.match(/\/projects\/[^\/]*$/)) {
          return Observable.of(new HttpResponse({
            status: 200,
            body: mockProject
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
