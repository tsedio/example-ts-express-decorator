import {
    Controller, Authenticated, Get, PathParams, Post, BodyParams, Put
} from "ts-express-decorators";

import EventCtrl from './EventCtrl';
import CalendarsService from '../../services/CalendarsService';
import Calendar from '../../models/Calendar';

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller depedencies.
 *
 * In this case, EventCtrl is a depedency of CalendarCtrl.
 * All routes of EventCtrl will be mounted on the `/calendars` path.
 */
@Controller("/calendars", EventCtrl)
export default class CalendarCtrl {

    constructor(
        private calendarsService: CalendarsService
    ) {

    }

    @Get('/:id')
    @Authenticated()
    find(
        @PathParams('id') id: string
    ): Promise<Calendar> {
        return this.calendarsService.find(id);
    }

    @Post('/')
    @Authenticated()
    save(
        @BodyParams() calendar: Calendar
    ) {
        return this.calendarsService.create(calendar);
    }

    @Put('/:id')
    @Authenticated()
    update(
        @PathParams('id') id: string,
        @BodyParams() calendar: Calendar
    ) {
        return this.calendarsService.update(calendar);
    }

    @Get('/')
    //@Authenticated()
    query() {
        return this.calendarsService.query();
    }

}