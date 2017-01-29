import {
    Controller, Get, Post, Put, Delete, Response, Authenticated, PathParams,
    BodyParams
} from "ts-express-decorators";

import EventsService from '../../services/EventsService';
import CalendarEvent from '../../models/Event';

@Controller("/events")
export default class EventCtrl {

    constructor(private eventsService: EventsService) {

    }

    /**
     * Find an event by his id
     * @returns {null}
     * @param id
     */
    @Get('/:id')
    @Authenticated()
    find(@PathParams('id') id: string): Promise<CalendarEvent> {

        return this.eventsService.find(id);
    }

    /**
     * Create a new event for a calendar.
     * @returns {null}
     */
    @Put('/')
    @Authenticated()
    create(@BodyParams() event: CalendarEvent): Promise<CalendarEvent> {
        return this.eventsService.create(event);
    }

    /**
     *
     * @returns {null}
     */
    @Post('/:id')
    @Authenticated()
    update(@BodyParams() event: CalendarEvent): Promise<CalendarEvent> {
        return this.eventsService.update(event);
    }


    @Delete('/:id')
    @Authenticated()
    remove(): Promise<any> {
        return null;
    }

    @Get('/')
    @Authenticated()
    query(@BodyParams('calendarId') calendarId): Promise<CalendarEvent[]> {
        return this.eventsService.query(calendarId);
    }
}