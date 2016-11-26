import {
    Controller, Authenticated, Get, PathParams, Post, BodyParams, Put
} from "ts-express-decorators";

import {$log} from "ts-log-debug";
import * as Express from "express";
import {NotFound} from "ts-httpexceptions";
import EventCtrl from './EventCtrl';
import CalendarsService from '../../services/CalendarsService';
import {ICalendar} from '../../services/CalendarsService';

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
    ): ICalendar {

        console.log('ID =>', id);
        const calendar = this.calendarsService.find(id);
        console.log('Result=>', calendar);

        if (calendar){
            return calendar;
        }

        throw new NotFound("Calendar not found");
    }

    @Post('/')
    @Authenticated()
    save(
        @BodyParams('name') name: string
    ) {
        return this.calendarsService.create(name);
    }

    @Put('/:id')
    @Authenticated()
    update(
        @PathParams('id') id: string,
        @BodyParams('name') name: string
    ) {
        return this.calendarsService.update({id: id, name: name});
    }

    @Get('/')
    @Authenticated()
    query(

    ) {
        return this.calendarsService.query();
    }

}