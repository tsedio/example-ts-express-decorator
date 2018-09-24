import {AuthenticatedMiddleware, IMiddleware, OverrideMiddleware, EndpointInfo, EndpointMetadata, Req} from "@tsed/common";
import {AuthService} from "../services/auth.service";
import {$log} from "ts-log-debug";

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthMiddleware implements IMiddleware {

    constructor(private authService: AuthService) {
        $log.warn('AuthMiddleware built')
    }

    async use(@EndpointInfo() endpoint: EndpointMetadata, @Req() request: any) {
        // auth logic
    }

}