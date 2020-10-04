import { Document, Schema, model } from "mongoose";

export interface Docs extends Document {
    pageTitle: string;
    content: string;
    linkedFiles: Array<[string, string]>;
}

const docsSchema = new Schema({
    pageTitle: String,
    content: String,
    linkedFiles: Array
});

export const DocsModel = model<Docs>('Docs', docsSchema);
