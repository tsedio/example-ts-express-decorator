import {ServerLoader, ServerSettings} from "@tsed/common";
import {$log} from "ts-log-debug";
import * as path from "path";

@ServerSettings({
  rootDir: __dirname,
  passport: {},
  mongoose: {
    url: "mongodb://127.0.0.1:27017/example-mongoose-test"
  },
  debug: true
})
export class CronJob extends ServerLoader {
  async start() {
    $log.start();
    const start = new Date();
    await this.loadSettingsAndInjector();
    await this.injector.emit("$onCronReady"); // create a custom hook (event) for your services

    $log.info(`Down in ${new Date().getTime() - start.getTime()} ms`);
  }
}

new CronJob().start();