import {Middleware, PathParams, Required} from "ts-express-decorators";
import {NotFound} from "ts-httpexceptions";
import {CalendarsService} from "../services/CalendarsService";

@Middleware()
export class CheckCalendarIdMiddleware {
    constructor(private calendarService: CalendarsService) {

    }

    async use(@Required() @PathParams("calendarId") calendarId: string) {

        try {
            await this.calendarService.find(calendarId);
        } catch (er) {
            throw new NotFound("Calendar not found");
        }

    }
}