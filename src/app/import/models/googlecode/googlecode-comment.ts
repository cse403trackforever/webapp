import { GoogleCodeAttachment } from './googlecode-attachment';

export interface GoogleCodeComment {
    id: number;
    commenterId: number;
    content: string;
    timestamp: number;
    attachments: Array<GoogleCodeAttachment>;
}
