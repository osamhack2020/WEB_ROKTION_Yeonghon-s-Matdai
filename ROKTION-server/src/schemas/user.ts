import { Document, Schema, model, Types } from "mongoose";

export interface Tag {
    name: string;
    color: string;
}

export interface DocView {
    docId: Types.ObjectId;
    docTags: Array<Number>;
}

export interface User extends Document {
    tagId: number;
    passwd: string;
    passwdSalt: string;
    name: string;
    rank: string;
    regiment: string;
    isOfficer: boolean;
    tags: Array<Tag>;
    relatedDocs: {
        created: Array<DocView>,
        shared: Array<DocView>,
    };
    recentLogin: Date;
}

const userSchema = new Schema({
    tagId: {
        type: Number,
        required: true,
        unique: true,
    },
    passwd: {
        type: String,
        required: true,
    },
    passwdSalt: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rank: String,
    regiment: String,
    isOfficer: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: Array,
        default: []
    },
    relatedDocs: {
        type: Object,
        created: {
            type: Array,
            default: []
        },
        shared: {
            type: Array,
            default: []
        },
    },
    recentLogin: Date,
});

export const UserModel = model<User>('User', userSchema);
