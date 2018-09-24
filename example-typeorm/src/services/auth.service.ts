import {Service} from "@tsed/common";
import {UsersService} from "./users.service";
import {$log} from "ts-log-debug";

@Service()
export class AuthService {

    constructor(
        userService: UsersService,
    ) {
        $log.warn('===>', userService);
    }
}