import {Document, model, Schema} from "mongoose";

export const schema = new Schema({
    name: {
        type: String,
        required: true
    }
});

export interface Calendar extends Document {
    _id: any;
    name: string;
}

export const Calendar = model<Calendar>("Calendar", schema);