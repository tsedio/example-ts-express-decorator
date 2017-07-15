import {GlobalAcceptMimesMiddleware, Inject, ServerLoader, ServerSettings} from "ts-express-decorators";
import {$log} from "ts-log-debug";
import Path = require("path");

const rootDir = Path.resolve(__dirname);


@ServerSettings({
    rootDir,
    mount: {
        "/rest": `${rootDir}/controllers/**/**.js`
    },
    componentsScan: [
        "${rootDir}/middlewares/**/**.js",
        "${rootDir}/services/**/**.js"
    ],
    acceptMimes: ["application/json"],
    passport: {},
    debug: true
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    @Inject()
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