
import * as Express from "express";
import {$log} from "ts-log-debug";
import {ServerLoader, IServerLifecycle} from "ts-express-decorators";
import Path = require("path");
import MongooseService from './services/MongooseService';

/**
 * Create a new Server that extends ServerLoader.
 */
export class Server extends ServerLoader implements IServerLifecycle {
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        super();

        let appPath = Path.resolve(__dirname);
        
        this.mount('/rest', appPath + "/controllers/**/**.js")
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }

    /**
     *
     * @returns {Promise<Mongoose.Connection>}
     */
    $onInit(): Promise<any> {
        return MongooseService
            .connect()
            .then(() => $log.debug('DB connected'));
    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void|Promise<any> {

        const morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session'),
            passport = require('passport');


        this
            .use(morgan('dev'))
            .use(ServerLoader.AcceptMime("application/json"))

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
            .use(passport.initialize())
            .use(passport.session());

        return null;
    }

    /**
     * Customize this method to manage all errors emitted by the server and controllers.
     * @param error
     * @param request
     * @param response
     * @param next
     */
    $onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        if (response.headersSent) {
            return next(error);
        }

        // MONGOOSE ERROR MANAGEMENT
        if (error.name === "CastError" || error.name === "ObjectID" || error.name === "ValidationError") {
            response.status(400).send("Bad Request");
            return next();
        }

        next(error);
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


    $onServerInitError(error): any {
        console.error('Server encounter an error =>', error);
    }
    /**
     * Start your server. Enjoy it !
     * @returns {Promise<U>|Promise<TResult>}
     */
    static Initialize(): Promise<any> {

        $log.info('Initialize server');

        return new Server()
            .start()
            .then(() => {
                $log.info('Server started...');
            });
    }
    
}