import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import * as Path from "path";
import {$log} from "ts-log-debug";
import {MongooseService} from "./services/MongooseService";

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    mount: {
        "/rest": `${rootDir}/controllers/**/**.js`
    },
    acceptMimes: ["application/json"],
    passport: {},
    httpPort: 8001,
    httpsPort: false,
    debug: false
})
export class Server extends ServerLoader {

    $onInit(): Promise<any> {
        return MongooseService
            .connect()
            .then(() => $log.debug("DB connected"));
    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void | Promise<any> {

        const cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override"),
            session = require("express-session");

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))

            // Configure session used by Passport
            .use(session({
                secret: "mysecretkey",
                resave: true,
                saveUninitialized: true,
                maxAge: 36000,
                cookie: {
                    path: "/",
                    httpOnly: true,
                    secure: false,
                    maxAge: null
                }
            }));

        return null;
    }

    $onReady() {
        $log.debug("Server initialized");
    }

    $onServerInitError(error): any {
        $log.error("Server encounter an error =>", error);
    }
}