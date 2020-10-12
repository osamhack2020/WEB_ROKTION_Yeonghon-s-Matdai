import { Document, Schema, model, Types } from "mongoose";

export enum DocStatus {
    doing,
    document,
    todo,
    done
}

export interface DocInfo extends Document {
    title: string;
    author: Types.ObjectId;
    status: DocStatus;
    contents: Array<{
        title: string,
        pageId: Types.ObjectId
    }>;
    shareOption: {
        director: Array<Types.ObjectId>,
        editor: Array<Types.ObjectId>,
        viewer: Array<Types.ObjectId>,
    };
    edited: [Date, Types.ObjectId];
}

const docInfoSchema = new Schema({
    title: String,
    author: Types.ObjectId,
    status: {
        type: DocStatus,
        default: DocStatus.doing
    },
    contents: Array,
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
        type: Object,
        editor: Types.ObjectId,
        editTime: {
            type: Date,
            default: new Date()
        }
    }
});

export const DocInfoModel = model<DocInfo>('DocInfo', docInfoSchema);
