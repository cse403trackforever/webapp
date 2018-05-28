import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { mockTrackforeverProject } from './import/models/trackforever/mock/mock-trackforever-project';
import { Observable, of } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

/**
 * This interceptor lets us mock the backend while it's still in development.
 * NOT for unit testing! (use https://angular.io/guide/http#testing-http-requests instead)
 */
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(null).pipe(
      mergeMap(() => {
        if (request.url.startsWith(environment.apiUrl)) {
          // mock getIssues
          if (request.url.endsWith('/issues')) {
            return of(new HttpResponse({
              status: 200,
              body: mockTrackforeverProject.issues[0]
            }));
          }

          // mock getProjects
          if (request.url.endsWith('/projects')) {
            return of(new HttpResponse({
              status: 200,
              body: [mockTrackforeverProject]
            }));
          }

          // mock getProject
          if (request.url.match(/\/projects\/[^\/]*$/)) {
            return of(new HttpResponse({
              status: 200,
              body: mockTrackforeverProject
            }));
          }
        }

        // pass through
        return next.handle(request);
      }),

      // ensures delay
      materialize(),
      delay(500),
      dematerialize()
    );
  }
}
