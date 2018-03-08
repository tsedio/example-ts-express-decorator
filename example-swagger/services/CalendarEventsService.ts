import {ConverterService, Service} from "@tsed/common";
import {BadRequest} from "ts-httpexceptions";
import {$log} from "ts-log-debug/lib";
import {CalendarEvent, CalendarEventModel} from "../models/CalendarEvent";

@Service()
export class CalendarEventsService {

    constructor(private converterService: ConverterService) {

    }

    /**
     *
     * @param model
     */
    private deserialize = (model: any): CalendarEvent =>
        this.converterService.deserialize(model.toObject && model.toObject() || model, CalendarEvent);


    /**
     * Find a CalendarEvent by his ID.
     * @param id
     * @returns {undefined|EventModel}
     */
    async find(id: string): Promise<CalendarEvent> {

        const event = await CalendarEventModel.findById(id).exec();

        return this.deserialize(event);
    }


    /**
     *
     * @param event
     * @returns {Promise<CalendarEvent>}
     */
    async save(event: CalendarEvent) {
        CalendarEventsService.checkPrecondition(event);
        $log.debug({message: "Validate event", event});
        const eventModel = new CalendarEventModel(event);

        await eventModel.validate();
        $log.debug({message: "Save event", eventModel});
        await eventModel.update(event, {upsert: true});

        $log.debug({message: "Event saved", event});

        return this.deserialize(eventModel);
    }


    /**
     * Return all CalendarEvent for a calendarID.
     * @returns {CalendarEvent[]}
     */
    async query(calendarId: string): Promise<CalendarEvent[]> {
        const events = await CalendarEventModel
            .find({calendarId: calendarId})
            .exec();

        return events.map(event => this.deserialize(event));
    }

    /**
     *
     * @param id
     * @returns {Promise<Calendar>}
     */
    async remove(id: string): Promise<void> {
        await CalendarEventModel.findById(id).remove().exec();
    }

    /**
     *
     * @param event
     */
    private static checkPrecondition(event: CalendarEvent) {

        if (event.dateStart.getTime() > event.dateEnd.getTime()) {
            new BadRequest("dateStart to be under dateEnd.");
        }

    }
}