
import {model, Schema} from 'mongoose';
import {JsonProperty} from 'ts-express-decorators';

export const CalendarSchema = new Schema({
    name: {
        type: String,
        required: "Calendar name are required"
    },

    dateCreated: {
        type: Date,
        default: Date.now
    },

    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

export const CalendarModel = model<any>('Calendar', CalendarSchema);

/**
 *
 */
export default class Calendar {

    @JsonProperty('id')
    _id: string;

    @JsonProperty('name')
    name: string;

    @JsonProperty()
    dateCreate: Date = new Date();

    @JsonProperty()
    events: string[];
}



