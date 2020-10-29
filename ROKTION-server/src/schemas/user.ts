import { Document, Schema, model, Types } from "mongoose";

export interface Tag {
    name: string;
    color: string;
}

export interface DocView {
    docId: Types.ObjectId;
    docTags: Array<Number>;
    alert: Number;
}

export interface User extends Document {
    tagId: string;
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
        type: String,
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
        default: [
            {
                name: '진행',
                color: '#89F5A4'
            },
            {
                name: '예정',
                color: '#F7DE88'
            },
            {
                name: '완료',
                color: '#96EDF5'
            },
            {
                name: '문서',
                color: '#A2ADF5'
            },
            {
                name: '중요',
                color: '#F76F78'
            }
        ]
    },
    relatedDocs: {
        type: Object,
        required: true,
        created: {
            type: Array,
            required: true,
            default: []
        },
        shared: {
            type: Array,
            required: true,
            default: []
        },
    },
    recentLogin: Date,
});

export const UserModel = model<User>('User', userSchema);
