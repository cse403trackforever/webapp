import { GoogleCodeIssueSummary } from './googlecode-issuesummary';

export interface GoogleCodeIssuePage {
    pageNumber: Number;
    totalPages: Number;
    issues: Array<GoogleCodeIssueSummary>;
}
