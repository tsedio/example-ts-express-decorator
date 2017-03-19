import {Controller, All, Get, RouteService} from "ts-express-decorators";
import {$log} from "ts-log-debug";

@Controller("/rest")
export class RestCtrl {

    constructor(
        private routeService: RouteService
    ) {

    }

    @Get('/')
    public getRoutes(){

        return this.routeService.getAll();

    }
}