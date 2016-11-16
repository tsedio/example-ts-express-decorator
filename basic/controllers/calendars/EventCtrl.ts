import {Controller, Get, Post, Put, Delete, Response, ICrud, IPromise} from "ts-express-decorators";

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
    save(

    ): IPromise<any> | void {



        return null;
    }

    /**
     *
     * @returns {null}
     */
    @Post('/:id')
    update(

    ): IPromise<any> | void {


        return null;
    }

    /**
     *
     */
    @Delete('/:id')
    remove(

    ): IPromise<any> | void {
        return null;
    }

    @Get('/')
    query(

    ): IPromise<any[]> | void {

        return null;
    }
}