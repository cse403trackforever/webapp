import { GoogleCodeIssueSummary } from './googlecode-issuesummary';

export interface GoogleCodeIssuePage {
    pageNumber: number;
    totalPages: number;
    issues: Array<GoogleCodeIssueSummary>;
}
