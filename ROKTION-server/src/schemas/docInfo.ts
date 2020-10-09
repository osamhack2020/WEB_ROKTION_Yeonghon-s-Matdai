import { Document, Schema, model } from "mongoose";

export interface DocInfo extends Document {
    title: string;
    author: number;
    contents: Array<string>;
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
