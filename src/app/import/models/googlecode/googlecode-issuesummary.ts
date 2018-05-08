export interface GoogleCodeIssueSummary {
    id: Number;
    status: string;
    summary: string;
    labels: Array<string>;
    stars: Number;
    commentCount: Number;
}
