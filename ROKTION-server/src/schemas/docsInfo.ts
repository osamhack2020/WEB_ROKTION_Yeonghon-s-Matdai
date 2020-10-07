import { Document, Schema, model } from "mongoose";

export interface DocsInfo extends Document {
    title: string;
    author: number;
    contents: Array<string>;
    shareOption: object;
    edited: [Date, number];
}

const docsInfoSchema = new Schema({
    title: String,
    author: Number,
    contents: Array,
    shareOption: Object,
    edited: [Date, Number]
});

export const DocsInfoModel = model<DocsInfo>('DocsInfo', docsInfoSchema);
