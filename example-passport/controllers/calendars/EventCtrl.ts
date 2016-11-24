import {Controller, Get, Post, Put, Delete, Response, ICrud, IPromise, Authenticated} from "ts-express-decorators";

interface IEvent{
    id: string;
}

@Controller("/events")
export default class EventCtrl implements ICrud<IEvent> {

    /**
     *
     * @param response
     * @returns {null}
     */
    @Get('/:id')
    @Authenticated()
    find(
        @Response() response: any
    ): IPromise<IEvent> | void {

        response.send(200, 'OK');

        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Put('/')
    @Authenticated()
    save(

    ): IPromise<any> | void {



        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Post('/:id')
    @Authenticated()
    update(

    ): IPromise<any> | void {


        return null;
    }

    /**
     *
     */
    @Delete('/:id')
    @Authenticated()
    remove(

    ): IPromise<any> | void {
        return null;
    }

    @Get('/')
    @Authenticated()
    query(

    ): IPromise<any[]> | void {

        return null;
    }
}