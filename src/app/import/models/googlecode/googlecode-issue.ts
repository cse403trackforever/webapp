import { GoogleCodeComment } from './googlecode-comment';

export interface GoogleCodeIssue {
    id: number;
    status: string;
    summary: string;
    labels: Array<string>;
    stars: number;
    commentCount: number;
    comments: Array<GoogleCodeComment>;
}
