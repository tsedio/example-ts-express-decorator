import {Controller, All, RouteService} from "ts-express-decorators";
import {$log} from "ts-log-debug";

@Controller("/rest")
export class RestCtrl {

    constructor(
        private routeService: RouteService
    ) {

    }
    
    @All('/')
    public all() {
        $log.debug("Route ALL /rest");
    }


    @Get('/')
    public getRoutes(){

        return JSON.stringify(this.routeService.getRoutes());

    }
}