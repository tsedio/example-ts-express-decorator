import {$log} from "ts-log-debug";
import {Server} from "./Server";

$log.info("Initialize server");

new Server()
    .start()
    .then(() => {
        $log.info("Server started...");
    })
    .catch((err) => {
        $log.error(err);
    });