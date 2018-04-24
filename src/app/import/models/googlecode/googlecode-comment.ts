import { GoogleCodeAttachment } from './googlecode-attachment';

export interface GoogleCodeComment {
    id: Number;
    commenterId: Number;
    content: String;
    timestamp: Number;
    attachments: Array<GoogleCodeAttachment>;
}
