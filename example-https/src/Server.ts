import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import {$log} from "ts-log-debug";
import * as Fs from "fs";

@ServerSettings({
    rootDir: __dirname,
    acceptMimes: ["application/json"],
    httpPort: false,
    httpsPort: 1338,
    httpsOptions: {
        key: Fs.readFileSync("../ssl/key.pem"),
        cert: Fs.readFileSync("../ssl/cert.pem"),
        passphrase: "tsed"
    }
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void | Promise<any> {

        const cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override");

        this
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