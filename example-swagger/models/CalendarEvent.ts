import {model, Schema} from "mongoose";
import {JsonProperty} from "ts-express-decorators";
import {Description} from "ts-express-decorators/lib/swagger";

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
    @Description("Calendar ID")
    calendarId: string;

    @JsonProperty("name")
    @Description("The name of the event")
    name: string;

    @JsonProperty()
    @Description("Creation's date")
    dateCreate: Date = new Date();

    @JsonProperty()
    @Description("Last modification date")
    dateUpdate: Date = new Date();

    @JsonProperty()
    @Description("Beginning date of the event")
    dateStart: Date = new Date();

    @JsonProperty()
    @Description("Ending date of the event")
    dateEnd: Date = new Date();

    @JsonProperty()
    @Description("Description the event")
    description: string;
}

export const CalendarEventModel = model<any>("Event", schema);