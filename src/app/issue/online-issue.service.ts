import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConvertTrackforeverService } from '../import/import-trackforever/convert-trackforever.service';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { HashResponse } from '../sync/hash-response';
import { IssueService } from './issue.service';
import { environment } from '../../environments/environment';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { Observable } from 'rxjs';

/**
 * Fetches issues from a TrackForever server
 */
@Injectable()
export class OnlineIssueService implements IssueService {

  /**
   * Convert a map to an object
   * @param map to convert
   */
  static mapToObject(mapObj): object {
    return Object.assign({}, ...Array.from(mapObj).map(([k, v]) => ({[k]: v})));
  }

  /**
   * With the given type V convert an object into a typed map
   * @param obj object to turn into map
   */
  static objectToMap<V>(obj): Map<string, V> {
    return new Map<string, V>(Object.entries(obj) as [string, V][]);
  }

  constructor(private http: HttpClient) { }

  getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue> {
    return this.http.get<TrackForeverIssue>(`${environment.apiUrl}/issues/${projectKey}/${issueId}`);
  }

  setIssue(issue: TrackForeverIssue): Observable<Map<string, Map<string, string>>> {
    return this.http.put(`${environment.apiUrl}/issue`, issue).pipe(
      map(r => {
        const issueMap = new Map();
        Object.entries(r).forEach(v => issueMap.set(v[0], OnlineIssueService.objectToMap(v[1])));
        return issueMap;
      })
    );
  }

  setIssues(issues: Map<string, Array<TrackForeverIssue>>): Observable<Map<string, Map<string, string>>> {
    const issueObj = OnlineIssueService.mapToObject(issues);
    return this.http.put(`${environment.apiUrl}/issues`, issueObj).pipe(
      map(r => {
        const issueMap = new Map();
        Object.entries(r).forEach(v => issueMap.set(v[0], OnlineIssueService.objectToMap(v[1])));
        return issueMap;
      })
    );
  }

  getRequestedIssues(issueIds: Map<string, Array<string>>): Observable<Map<string, Array<TrackForeverIssue>>> {
    const issueIdsObj = OnlineIssueService.mapToObject(issueIds);
    return this.http.post<object>(`${environment.apiUrl}/issues`, issueIdsObj)
      .pipe(map(e => OnlineIssueService.objectToMap<Array<TrackForeverIssue>>(e)));
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return this.http.get(`${environment.apiUrl}/projects/${projectKey}`, {responseType: 'text'})
      .pipe(map(e => ConvertTrackforeverService.fromJson(e)));
  }

  getProjects(): Observable<Array<TrackForeverProject>> {
    return this.http.get(`${environment.apiUrl}/projects`, {responseType: 'text'})
      .pipe(map(e => ConvertTrackforeverService.fromJsonArray(e)));
  }

  setProjects(projects: Array<TrackForeverProject>): Observable<Map<string, string>> {
    console.log('update projects');
    console.log(projects);
    return this.http.put(`${environment.apiUrl}/projects`, ConvertTrackforeverService.toJson(projects),
    {headers: {'Content-Type': 'application/json; charset=utf-8'}}).pipe(
      map(r => OnlineIssueService.objectToMap(r))
    );
  }

  setProject(project: TrackForeverProject): Observable<Map<string, string>> {
    return this.http.put(`${environment.apiUrl}/project`, ConvertTrackforeverService.toJson(project),
    {headers: {'Content-Type': 'application/json; charset=utf-8'}}).pipe(
      map(r => OnlineIssueService.objectToMap(r))
    );
  }

  getRequestedProjects(projectIds: Array<string>): Observable<Array<TrackForeverProject>> {
    return this.http.post(`${environment.apiUrl}/projects`, projectIds,
    {responseType: 'text', headers: {'Content-Type': 'application/json; charset=utf-8'}})
      .pipe(map(e => ConvertTrackforeverService.fromJsonArray(e)));
  }

  getHashes(): Observable<Map<string, HashResponse>> {
    // Get and map {projId: {project: projectHash, issues: {issueId, issueHash}}} to Map<string, HashResponse>
    return this.http.get(`${environment.apiUrl}/hashes`)
      .pipe(
        tap(e => console.log('getHashes', e)),
        // map from {projectId: {project: projectHash, issues: {issueId: issueHash}}} to Map<string, HashResponse>
        map(e => {
          const responseMap = new Map<string, HashResponse>();
          Object.entries(e).forEach((a: [string, {project: string, issues: {}}]) => {
            responseMap.set(a[0], {project: a[1].project, issues: OnlineIssueService.objectToMap(a[1].issues)});
          });
          return responseMap;
        })
      );
  }
}
