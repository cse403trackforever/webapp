export interface GoogleCodeIssueSummary {
    id: number;
    status: string;
    summary: string;
    labels: Array<string>;
    stars: number;
    commentCount: number;
}
