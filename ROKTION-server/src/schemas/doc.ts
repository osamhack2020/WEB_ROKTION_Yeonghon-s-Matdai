import { Document, Schema, model } from "mongoose";

export interface Doc extends Document {
    content: string;
    linkedFiles: Array<{
        fileName: string,
        fileUrl: string
    }>;
}

const docSchema = new Schema({
    content: String,
    linkedFiles: {
        type: Array,
        default: [],
    }
});

export const DocModel = model<Doc>('Doc', docSchema);
