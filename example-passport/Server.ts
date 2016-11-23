
import * as Express from "express";
import * as Bluebird from "bluebird";
import {$log} from "ts-log-debug";
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");

/**
 * Create a new Server that extends ServerLoader.
 */
export class Server extends ServerLoader {
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        super();

        let appPath = Path.resolve(__dirname);
        
        this.setEndpoint('/rest')
            .scan(appPath + "/controllers/**/**.js")
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public importMiddlewares(): Server {
        let morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session'),
            passport = require('passport');

        this
            .use(morgan('dev'))
            .use(ServerLoader.AcceptMime("application/json"))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))

            // Configure session used by Passport
            .use(session({
                secret: 'keyboard cat',
                resave: false,
                saveUninitialized: true,
                cookie: { secure: true }
            }))

            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())

            // Configure passport JS
            .use(passport.initialize())
            .use(passport.session());

        return this;
    }

    /**
     * Customize this method to manage all errors emitted by the server and controllers.
     * @param error
     * @param request
     * @param response
     * @param next
     */
    public onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): any {
        return super.onError(error, request, response, next);
    }

    /**
     * Set here your check authentification strategy.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    public isAuthenticated(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {

        // Just use passport strategy method to know if the user is Authenticated :)
        return request.isAuthenticated();
    }
    /**
     * Start your server. Enjoy it !
     * @returns {Promise<U>|Promise<TResult>}
     */
    static Initialize(): Bluebird<any> {

        $log.info('Initialize server');

        return new Server()
            .start()
            .then(() => {
                $log.info('Server started...');
            });
    }
    
}