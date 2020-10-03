import { Document, Schema, model } from "mongoose";

export interface User extends Document {
    name: string;
    tagId: number;
    permission: boolean;
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    tagId: {
        type: Number,
        required: true,
        unique: true,
    },
    permission: {
        type: Boolean,
        default: false,
    }
});

export const UserModel = model<User>('User', userSchema);
