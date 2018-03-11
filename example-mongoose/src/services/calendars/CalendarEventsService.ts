import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {BadRequest} from "ts-httpexceptions";
import {$log} from "ts-log-debug/lib";
import {CalendarEvent} from "../../models/events/CalendarEvent";

@Service()
export class CalendarEventsService {

    constructor(@Inject(CalendarEvent) private eventModel: MongooseModel<CalendarEvent>) {

    }


    /**
     * Find a CalendarEvent by his ID.
     * @param id
     * @returns {undefined|EventModel}
     */
    async find(id: string): Promise<CalendarEvent> {
        return await this.eventModel.findById(id).exec();
    }


    /**
     *
     * @param event
     * @returns {Promise<CalendarEvent>}
     */
    async save(event: CalendarEvent) {
        CalendarEventsService.checkPrecondition(event);
        $log.debug({message: "Validate event", event});
        const eventModel = new this.eventModel(event);

        await eventModel.validate();
        $log.debug({message: "Save event", eventModel});
        await eventModel.update(event, {upsert: true});

        $log.debug({message: "Event saved", event});

        return eventModel;
    }


    /**
     * Return all CalendarEvent for a calendarID.
     * @returns {CalendarEvent[]}
     */
    async query(calendarId: string): Promise<CalendarEvent[]> {
        const events = await this.eventModel
            .find({calendarId: calendarId})
            .exec();

        return events;
    }

    /**
     *
     * @param id
     * @returns {Promise<Calendar>}
     */
    async remove(id: string): Promise<void> {
        return await this.eventModel.findById(id).remove().exec();
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