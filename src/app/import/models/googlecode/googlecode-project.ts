import { GoogleCodeLink } from './googlecode-link';

export interface GoogleCodeProject {
    domain: string;
    name: string;
    summary: string;
    description: string;
    stars: number;
    license?: string;
    contentLicense: string;
    labels: Array<string>;
    links: Array<GoogleCodeLink>;
    blogs: Array<GoogleCodeLink>;
    creationTime?: number;
    hasSource: boolean;
    repoType: string;
    subRepos: Array<string>;
    ancestorRepo?: string;
    logoName?: string;
    imageUrl?: string;
    movedTo?: string;
}
