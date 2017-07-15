import {ConverterService, Service} from "ts-express-decorators";
import {BadRequest} from "ts-httpexceptions";
import {CalendarEvent, EventModel} from "../models/Event";

@Service()
export class EventsService {

    constructor(private converterService: ConverterService) {

    }

    /**
     *
     * @param model
     */
    private deserialize = (model): CalendarEvent =>
        this.converterService.deserialize(model, event) as CalendarEvent;


    /**
     * Find a CalendarEvent by his ID.
     * @param id
     * @returns {undefined|EventModel}
     */
    public find = (id: string): Promise<CalendarEvent> =>
        EventModel
            .findById(id)
            .exec()
            .then(event => this.deserialize(event));


    /**
     * Create a new CalendarEvent
     * @returns {{id: any, name: string}}
     * @param CalendarEvent
     */
    public create(event: CalendarEvent): Promise<CalendarEvent> {

        EventsService.checkPrecondition(event);

        return EventModel
            .create(CalendarEvent)
            .then(event => this.deserialize(event));

    }


    /**
     * Return all CalendarEvent for a calendarID.
     * @returns {CalendarEvent[]}
     */
    public query = (calendarId: string): Promise<CalendarEvent[]> =>
        EventModel
            .find({calendarId: calendarId})
            .exec()
            .then(Events =>
                Events.map(event => this.deserialize(event))
            );

    /**
     *
     * @returns {CalendarEvent}
     * @param event
     */
    public update(event: CalendarEvent): Promise<CalendarEvent> {

        EventsService.checkPrecondition(event);

        return EventModel
            .findById(event._id)
            .exec()
            .then(eventResult => {

                delete event._id;
                Object.assign(eventResult, event);

                return eventResult.save();
            })
            .then<CalendarEvent>(event => this.deserialize(event));
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