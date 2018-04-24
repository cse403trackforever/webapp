import { GoogleCodeLink } from './googlecode-link';

export interface GoogleCodeProject {
    domain: String;
    name: String;
    summary: String;
    description: String;
    stars: Number;
    license?: String;
    contentLicense: String;
    labels: Array<String>;
    links: Array<GoogleCodeLink>;
    blogs: Array<GoogleCodeLink>;
    creationTime?: Number;
    hasSource: Boolean;
    repoType: String;
    subRepos: Array<String>;
    ancestorRepo?: String;
    logoName?: String;
    imageUrl?: String;
    movedTo?: String;
}
