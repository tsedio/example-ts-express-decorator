import * as Express from "express";
import {$log} from "ts-log-debug";
import {ServerLoader, ServerSettings, Inject, GlobalAcceptMimesMiddleware} from "ts-express-decorators";
import Path = require("path");
import MongooseService from './services/MongooseService';
import PassportLocalService from "./services/PassportLocalService";

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    mount: {
        '/rest': `${rootDir}/controllers/**/**.js`
    },
    acceptMimes: ["application/json"]
})
export class Server extends ServerLoader {

    $onInit(): Promise<any> {
        return MongooseService
            .connect()
            .then(() => $log.debug('DB connected'));
    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    @Inject()
    $onMountingMiddlewares(passportService: PassportLocalService): void|Promise<any> {

        const morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session'),
            passport = require('passport');


        this
            .use(morgan('dev'))
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
                secret: 'mysecretkey',
                resave: true,
                saveUninitialized: true,
                maxAge: 36000,
                cookie: {
                    path: '/',
                    httpOnly: true,
                    secure: false,
                    maxAge: null
                }
            }))
            // Configure passport JS
            .use(passportService.middlewareInitialize())
            .use(passportService.middlewareSession());

        return null;
    }

    /**
     * Set here your check authentification strategy.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    $onAuth(request: Express.Request, response: Express.Response): boolean {
        return request.isAuthenticated();
    }

    $onReady() {
        $log.debug('Server initialized')
    }

    $onServerInitError(error): any {
        $log.error('Server encounter an error =>', error);
    }
}