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
    Status,
    Use
} from "ts-express-decorators";
import {NotFound} from "ts-httpexceptions";
import {Calendar} from "../../interfaces/Calendar";
import {CustomTokenMiddleware} from "../../middlewares/CustomTokenMiddleware";
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
    private AUTO_INC = 7;
    private calendars: Calendar[] = require("../../resources/calendars.json");

    constructor() {

    }

    /**
     * Example of customised call. You can use decorators to inject express object like `response` as `@Response`,
     * `request` as `@Request` and `next` as `@Next`.
     *
     * Another decorator are available to access quickly to the pathParams request. `@PathParams` take an expression in
     * first parameter.
     * @returns {{id: any, name: string}}
     */

    @Get("/:id")
    async get(@Required() @PathParams("id") id: string): Promise<Calendar> {

        const calendar = this.calendars.find(calendar => calendar.id === id);

        if (calendar) {
            return calendar;
        }

        throw new NotFound("Calendar not found");
    }

    /**
     * Your method can return a Promise to respond to a request.
     *
     * By default, the response is sent with status 200 and is serialized in JSON.
     *
     * @param request
     * @param id
     * @returns {Promise<Calendar>}
     */
    @Get("/promised/:id")
    async findWithPromise(@Required() @PathParams("id") id: string): Promise<Calendar> {

        const calendar = this.calendars.find(calendar => calendar.id === id);

        if (calendar) {
            return Promise.resolve(calendar);
        }

        throw new NotFound("Calendar not found");
    }

    /**
     * Your method can return a Promise to respond to a request.
     *
     * By default, the response is sent with status 200 and is serialized in JSON.
     *
     * @param id
     * @returns {Promise<Calendar>}
     */
    @Get("/status/:id")
    @Status(202)
    async changeStatus(@PathParams("id") id: string): Promise<Calendar> {
        const calendar = this.calendars.find(calendar => calendar.id === id);

        if (calendar) {
            return Promise.resolve(calendar);
        }

        throw new NotFound("Calendar not found");
    }

    /**
     * You can append a middleware to your route with `@Use`. Your middleware will be called before the method `getWithMiddleware`.
     * @returns {{user: (number|any|string)}}
     */
    @Get("/middleware")
    @Use(CustomTokenMiddleware)
    async getWithMiddleware(@PathParams("id") id: string): Promise<Calendar> {

        const calendar = this.calendars.find(calendar => calendar.id === id);

        if (calendar) {
            return Promise.resolve(calendar);
        }

        throw new NotFound("Calendar not found");
    }

    /**
     *
     * @param name
     * @returns {{id: number, name: string}}
     */
    @Put("/")
    async save(@BodyParams("name") @Required() name: string): Promise<Calendar> {
        this.AUTO_INC++;

        const calendar = {id: "" + this.AUTO_INC, name};
        this.calendars.push(calendar);

        return calendar;
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
        const calendar = await this.get(id);
        calendar.name = name;
        return calendar;
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
        this.calendars = this.calendars.filter(calendar => calendar.id === id);
    }

    @Get("/")
    @Authenticated()
    async getAllCalendars(): Promise<Calendar[]> {
        return this.calendars;
    }
}