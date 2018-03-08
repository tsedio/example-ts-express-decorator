import {
    Authenticated,
    BodyParams,
    Controller,
    Delete,
    Get,
    PathParams,
    Post,
    Put,
    Req,
    Required,
    Status
} from "@tsed/common";
import {NotFound} from "ts-httpexceptions";
import {Calendar} from "../../models/Calendar";
import {CalendarsService} from "../../services/CalendarsService";
import {EventCtrl} from "./EventCtrl";

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventsCtrl is a dependency of CalendarCtrl.
 * All routes of EventsCtrl will be mounted on the `/calendars` path.
 */
@Controller("/calendars", EventCtrl)
export class CalendarCtrl {

    constructor(private calendarsService: CalendarsService) {

    }

    @Get("/:id")
    async get(@Required() @PathParams("id") id: string): Promise<Calendar> {

        const calendar = await this.calendarsService.find(id);

        if (calendar) {
            return calendar;
        }

        throw new NotFound("Calendar not found");
    }

    @Put("/")
    save(@BodyParams() calendar: Calendar, @Req() request) {
        return this.calendarsService.save(calendar);
    }

    /**
     *
     * @param id
     * @param calendar
     * @returns {Promise<Calendar>}
     */
    @Post("/:id")
    async update(@PathParams("id") @Required() id: string,
                 @BodyParams() @Required() calendar: Calendar): Promise<Calendar> {

        return this
            .calendarsService
            .find(id)
            .then(() => this.calendarsService.save(calendar))
            .catch((err) => {
                throw new NotFound("Calendar id not found");
            });

    }

    /**
     *
     * @param id
     * @returns {{id: string, name: string}}
     */
    @Delete("/")
    @Authenticated()
    @Status(204)
    async remove(@BodyParams("id") @Required() id: string): Promise<void> {
        this.calendarsService.remove(id);
    }

    @Get("/")
    @Authenticated()
    async getAllCalendars(): Promise<Calendar[]> {
        return this.calendarsService.query();
    }
}