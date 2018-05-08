import { GoogleCodeAttachment } from './googlecode-attachment';

export interface GoogleCodeComment {
    id: Number;
    commenterId: Number;
    content: string;
    timestamp: Number;
    attachments: Array<GoogleCodeAttachment>;
}
