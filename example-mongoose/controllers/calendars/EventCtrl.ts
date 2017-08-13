import {
    Authenticated,
    BodyParams,
    Controller,
    Delete,
    Get,
    MergeParams,
    PathParams,
    Post,
    Put,
    Required,
    Status,
    UseBefore
} from "ts-express-decorators";
import {NotFound} from "ts-httpexceptions";
import {CheckCalendarIdMiddleware} from "../../middlewares/CheckCalendarId";
import {CalendarEvent} from "../../models/CalendarEvent";
import {CalendarEventsService} from "../../services/CalendarEventsService";


@Controller("/:calendarId/events")
@MergeParams(true)
export class EventCtrl {
    constructor(private calendarEventsService: CalendarEventsService) {

    }

    /**
     *
     * @returns {null}
     */
    @Get("/:id")
    @UseBefore(CheckCalendarIdMiddleware)
    async get(@PathParams("id") id: string): Promise<CalendarEvent> {
        return this.calendarEventsService
            .find(id)
            .catch((err) => {
                throw new NotFound("Event not found");
            });
    }

    /**
     *
     * @returns {null}
     */
    @Put("/")
    @UseBefore(CheckCalendarIdMiddleware)
    async save(@Required() @PathParams("calendarId") calendarId: string,
               @BodyParams() calendarEvent: CalendarEvent): Promise<CalendarEvent> {

        calendarEvent.calendarId = calendarId;

        return this.calendarEventsService.save(calendarEvent);
    }

    /**
     *
     * @returns {null}
     */
    @Post("/:id")
    @UseBefore(CheckCalendarIdMiddleware)
    async update(@PathParams("id") id: string,
                 @BodyParams() calendarEvent: CalendarEvent): Promise<CalendarEvent> {

        return this
            .calendarEventsService
            .find(id)
            .then(() => this.calendarEventsService.save(calendarEvent))
            .catch((err) => {
                throw new NotFound("Calendar id not found");
            });
    }

    /**
     *
     */
    @Delete("/:id")
    @Authenticated()
    @UseBefore(CheckCalendarIdMiddleware)
    @Status(204)
    async remove(@Required() @PathParams("calendarId") calendarId: string,
                 @PathParams("id") id: string): Promise<void> {
        return this.calendarEventsService.remove(id);
    }

    @Get("/")
    @UseBefore(CheckCalendarIdMiddleware)
    async getEvents(@Required() @PathParams("calendarId") calendarId: string): Promise<CalendarEvent[]> {
        return this.calendarEventsService.query(calendarId);
    }
}