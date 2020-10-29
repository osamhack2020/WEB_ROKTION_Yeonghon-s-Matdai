import { Document, Schema, model, Types } from "mongoose";

// 공유시 기본태그로 달려야돼서 필요함
export enum DocStatus {
    doing,
    todo,
    done,
    document,
}

export interface DocInfo extends Document {
    title: string;
    titleColor: string;
    description: string;
    author: Types.ObjectId;
    status: DocStatus;
    contents: Array<{
        pageId: Types.ObjectId,
        editing?: Types.ObjectId,
        edited: Date,
    }>;
    shareOption: {
        director: Array<string>,
        editor: Array<string>,
        viewer: Array<string>,
    };
    edited: Array<{
        editDate: Date, 
        editor: Types.ObjectId
    }>;
}

const shareOptionSchema = new Schema({
    director: {
        type: Array,
        default: [],
        required: true,
    },
    editor: {
        type: Array,
        default: [],
        required: true,
    },
    viewer: {
        type: Array,
        default: [],
        required: true,
    },
},{ _id : false });

const docInfoSchema = new Schema({
    title: String,
    titleColor: String,
    description: String,
    author: Types.ObjectId,
    status: {
        type: DocStatus,
        default: DocStatus.doing
    },
    contents: {
        type: Array,
        default: [],
    },
    shareOption: {
        type: shareOptionSchema,
        required: true,
    },
    edited: {
        type: Array,
        default: [],
    },
});

export const DocInfoModel = model<DocInfo>('DocInfo', docInfoSchema);
