import { Document, Schema, model } from "mongoose";

export interface Doc extends Document {
    pageTitle: string;
    content: string;
    linkedFiles: Array<[string, string]>;
}

const docSchema = new Schema({
    pageTitle: String,
    content: String,
    linkedFiles: Array
});

export const DocModel = model<Doc>('Doc', docSchema);
