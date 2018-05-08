import { GoogleCodeLink } from './googlecode-link';

export interface GoogleCodeProject {
    domain: string;
    name: string;
    summary: string;
    description: string;
    stars: Number;
    license?: string;
    contentLicense: string;
    labels: Array<string>;
    links: Array<GoogleCodeLink>;
    blogs: Array<GoogleCodeLink>;
    creationTime?: Number;
    hasSource: Boolean;
    repoType: string;
    subRepos: Array<string>;
    ancestorRepo?: string;
    logoName?: string;
    imageUrl?: string;
    movedTo?: string;
}
