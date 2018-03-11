import {JsonProperty} from "@tsed/common";
import {model, Schema} from "mongoose";

export const schema = new Schema({
    calendarId: {
        type: Schema.Types.ObjectId,
        ref: "Calendar"
    },

    name: {
        type: String,
        required: "Event name are required"
    },

    dateCreated: {
        type: Date,
        default: Date.now
    },

    dateUpdate: {
        type: Date,
        default: Date.now
    },

    dateStart: {
        type: Date,
        required: true
    },

    dateEnd: {
        type: Date,
        required: true
    },

    description: String
});

export class CalendarEvent {
    @JsonProperty("id")
    _id: string;

    @JsonProperty()
    calendarId: string;

    @JsonProperty("name")
    name: string;

    @JsonProperty()
    dateCreate: Date = new Date();

    @JsonProperty()
    dateUpdate: Date = new Date();

    @JsonProperty()
    dateStart: Date = new Date();

    @JsonProperty()
    dateEnd: Date = new Date();

    @JsonProperty()
    description: string;
}

export const CalendarEventModel = model<any>("Event", schema);