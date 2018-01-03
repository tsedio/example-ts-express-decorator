import {HeaderParams, IMiddleware, Middleware, Request} from "ts-express-decorators";
import {Unauthorized} from "ts-httpexceptions";

@Middleware()
export class CustomTokenMiddleware implements IMiddleware {
    /**
     *
     * @param auth
     * @param request
     */
    use(@HeaderParams("authorization") auth: string, @Request() request: Express.Request) {

        if (auth !== "secrettoken") {
            throw new Unauthorized("Access denied");
        }

        (<any>request).userId = "1";
    };
}