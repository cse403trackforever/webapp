import { GoogleCodeComment } from './googlecode-comment';

export interface GoogleCodeIssue {
    id: Number;
    status: string;
    summary: string;
    labels: Array<string>;
    stars: Number;
    commentCount: Number;
    comments: Array<GoogleCodeComment>;
}
