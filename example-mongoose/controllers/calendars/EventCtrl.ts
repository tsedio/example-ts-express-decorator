import {Authenticated, Controller, Delete, Get, Post, Put, Response} from "ts-express-decorators";

interface IEvent{
    id: string;
}

@Controller("/events")
export class EventCtrl {

    /**
     *
     * @param response
     * @returns {null}
     */
    @Get('/:id')
    @Authenticated()
    find(
        @Response() response: any): Promise<IEvent> | void {

        response.send(200, 'OK');

        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Put('/')
    @Authenticated()
    save(): Promise<any> | void {



        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Post('/:id')
    @Authenticated()
    update(): Promise<any> | void {


        return null;
    }

    /**
     *
     */
    @Delete('/:id')
    @Authenticated()
    remove(): Promise<any> | void {
        return null;
    }

    @Get('/')
    @Authenticated()
    query(): Promise<any[]> | void {

        return null;
    }
}