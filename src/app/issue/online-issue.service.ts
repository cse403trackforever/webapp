import { ImportTrackForeverService } from './../import/import-trackforever/import-trackforever.service';
import { TrackForeverProject } from './../import/models/trackforever/trackforever-project';
import { HashResponse } from './../sync/hash-response';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IssueService } from './issue.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';

/**
 * Fetches issues from a TrackForever server
 */
@Injectable()
export class OnlineIssueService implements IssueService {

  /**
   * Convert a map to an object
   * @param map to convert
   */
  static mapToObject(map): object {
    return Object.assign({}, ...Array.from(map).map(([k, v]) => ({[k]: v})));
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
    return this.http.post<string>(`${environment.apiUrl}/issues`, {
      projectKey,
      issueId
    }).map(e => JSON.parse(e));
  }

  setIssue(issue: TrackForeverIssue) {
    return this.http.put(`${environment.apiUrl}/issue`, issue);
  }

  setIssues(issues: Map<string, Array<TrackForeverIssue>>) {
    const issueObj = OnlineIssueService.mapToObject(issues);
    return this.http.put(`${environment.apiUrl}/issues`, issueObj);
  }

  getRequestedIssues(issueIds: Map<string, Array<string>>): Observable<Map<string, Array<TrackForeverIssue>>> {
    const issueIdsObj = OnlineIssueService.mapToObject(issueIds);
    return this.http.post<object>(`${environment.apiUrl}/issues`, issueIdsObj)
      .map(e => OnlineIssueService.objectToMap<Array<TrackForeverIssue>>(e));
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return this.http.get<string>(`${environment.apiUrl}/projects/${projectKey}`)
      .map(e => ImportTrackForeverService.fromJson(e));
  }

  getProjects(): Observable<Array<TrackForeverProject>> {
    return this.http.get<string>(`${environment.apiUrl}/projects`)
      .map(e => ImportTrackForeverService.fromJsonArray(e));
  }

  setProjects(projects: Array<TrackForeverProject>) {
    return this.http.put(`${environment.apiUrl}/projects`, ImportTrackForeverService.toJson(projects));
  }

  setProject(project: TrackForeverProject) {
    return this.http.put(`${environment.apiUrl}/project`, ImportTrackForeverService.toJson(project));
  }

  getRequestedProjects(projectIds: Array<string>): Observable<Array<TrackForeverProject>> {
    return this.http.post<string>(`${environment.apiUrl}/projects`, projectIds)
      .map(e => ImportTrackForeverService.fromJsonArray(e));
  }

  getHashes(): Observable<Map<string, HashResponse>> {
    return this.http.get<string>(`${environment.apiUrl}/hashes`)
      .map(e => OnlineIssueService.objectToMap<HashResponse>(e));
  }
}
