import {
    Authenticated,
    BodyParams,
    Controller,
    Delete,
    Get,
    PathParams,
    Post,
    Put,
    Required,
    Status
} from "ts-express-decorators";
import {NotFound} from "ts-httpexceptions";
import {Calendar} from "../../interfaces/Calendar";
import {CalendarsService} from "../../services/CalendarsService";
import {EventCtrl} from "./EventCtrl";

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventCtrl is a dependency of CalendarCtrl.
 * All routes of EventCtrl will be mounted on the `/calendars` path.
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
    save(@BodyParams("name") name: string) {
        return this.calendarsService.create(name);
    }

    /**
     *
     * @param id
     * @param name
     * @returns {Promise<Calendar>}
     */
    @Post("/:id")
    async update(@PathParams("id") @Required() id: string,
                 @BodyParams("name") @Required() name: string): Promise<Calendar> {
        return this.calendarsService.update({id, name});
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