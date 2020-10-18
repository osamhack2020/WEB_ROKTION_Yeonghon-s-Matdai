import { Document, Schema, model, Types } from "mongoose";

export enum DocStatus {
    doing,
    document,
    todo,
    done
}

export interface DocInfo extends Document {
    title: string;
    description: string;
    author: Types.ObjectId;
    status: DocStatus;
    contents: Array<{
        pageId: Types.ObjectId,
        editing: Types.ObjectId,
        edited: Date,
    }>;
    shareOption: {
        director: Array<Types.ObjectId>,
        editor: Array<Types.ObjectId>,
        viewer: Array<Types.ObjectId>,
    };
    edited: Array<{
        editDate: Date, 
        editor: Types.ObjectId
    }>;
}

const docInfoSchema = new Schema({
    title: String,
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
        type: Object,
        director: {
            type: Array,
            default: []
        },
        editor: {
            type: Array,
            default: []
        },
        viewer: {
            type: Array,
            default: []
        },
    },
    edited: {
        type: Array,
        default: [],
    },
});

export const DocInfoModel = model<DocInfo>('DocInfo', docInfoSchema);
