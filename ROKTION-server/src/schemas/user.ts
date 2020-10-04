import { Document, Schema, model } from "mongoose";

export interface User extends Document {
    tagId: number;
    passwd: string;
    name: string;
    belongs: string;
    isOfficer: boolean;
    relatedDocs: object;
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
    name: {
        type: String,
        required: true,
    },
    belongs: String,
    isOfficer: Boolean,
    relatedDocs: Object,
    recentLogin: Date,
});

export const UserModel = model<User>('User', userSchema);
