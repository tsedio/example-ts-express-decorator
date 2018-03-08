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
} from "@tsed/common";
import {Description, Summary} from "ts-express-decorators/lib/swagger";
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
    @Summary("Return a calendar from his ID")
    @Status(200, {description: "Success"})
    async get(@Description("The calendar ID")
              @Required() @PathParams("id") id: string): Promise<Calendar> {

        const calendar = await this.calendarsService.find(id);

        if (calendar) {
            return calendar;
        }

        throw new NotFound("Calendar not found");
    }

    @Put("/")
    @Summary("Create a new Calendar")
    @Status(201, {description: "Created"})
    save(@Description("Calendar model")
         @BodyParams() calendar: Calendar) {
        return this.calendarsService.save(calendar);
    }

    /**
     *
     * @param id
     * @param calendar
     * @returns {Promise<Calendar>}
     */
    @Post("/:id")
    @Summary("Update calendar information")
    @Status(200, {description: "Success"})
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
    @Summary("Remove a calendar. You need to login to remove a calendar.")
    @Status(204, {description: "No content"})
    async remove(@BodyParams("id") @Required() id: string): Promise<void> {
        this.calendarsService.remove(id);
    }

    @Get("/")
    @Authenticated()
    @Summary("Return all calendars")
    @Status(200, {description: "Success"})
    async getAllCalendars(): Promise<Calendar[]> {
        return this.calendarsService.query();
    }
}