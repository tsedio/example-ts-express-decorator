import * as Fs from "fs";
import * as Path from "path";
import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "ts-express-decorators";
import {$log} from "ts-log-debug";
const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    mount: {
        "/rest": `${rootDir}/controllers/**/**.js`
    },
    acceptMimes: ["application/json"],
    httpPort: false,
    httpsPort: 1338,
    httpsOptions: {
        key: Fs.readFileSync("./ssl/key.pem"),
        cert: Fs.readFileSync("./ssl/cert.pem"),
        passphrase: "tsed"
    }
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void | Promise<any> {

        const morgan = require("morgan"),
            cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override");


        this
            .use(morgan("dev"))
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
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