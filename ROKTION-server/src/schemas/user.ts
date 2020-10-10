import { Document, Schema, model, Types } from "mongoose";

export interface User extends Document {
    tagId: number;
    passwd: string;
    passwdSalt: string;
    name: string;
    belongs: string;
    isOfficer: boolean;
    relatedDocs: {
        created: Array<Types.ObjectId>,
        shared: Array<Types.ObjectId>,
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
    belongs: String,
    isOfficer: {
        type: Boolean,
        default: false,
    },
    relatedDocs: {
        created: Array,
        shared: Array,
    },
    recentLogin: Date,
});

export const UserModel = model<User>('User', userSchema);
