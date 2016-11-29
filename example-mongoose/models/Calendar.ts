
import {Document, model, Schema} from 'mongoose';

export const schema = new Schema({
    name:{
        type:String,
        required:true
    }
});

export interface ICalendar {
    _id: string;
    name: string;
}

export interface ICalendar extends Document {
    name: string
}

export const Calendar = model<ICalendar>('Calendar', schema);