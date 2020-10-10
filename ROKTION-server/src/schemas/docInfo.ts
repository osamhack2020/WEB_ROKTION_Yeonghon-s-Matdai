import { Document, Schema, model, Types } from "mongoose";

export interface DocInfo extends Document {
    title: string;
    author: number;
    contents: Array<{
        title: string,
        pageId: Types.ObjectId
    }>;
    shareOption: object;
    edited: [Date, number];
}

const docInfoSchema = new Schema({
    title: String,
    author: Number,
    contents: Array,
    shareOption: Object,
    edited: [Date, Number]
});

export const DocInfoModel = model<DocInfo>('DocInfo', docInfoSchema);
