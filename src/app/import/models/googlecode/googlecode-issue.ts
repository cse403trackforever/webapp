import { GoogleCodeComment } from './googlecode-comment';

export interface GoogleCodeIssue {
    id: Number;
    status: String;
    summary: String;
    labels: Array<String>;
    stars: Number;
    commentCount: Number;
    comments: Array<GoogleCodeComment>;
}
