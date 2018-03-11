import {Service} from "@tsed/common";
import * as Mongoose from "mongoose";
import {Value} from "ts-json-properties";
import {$log} from "ts-log-debug";

(<any>Mongoose).Promise = global.Promise;

class MongooseUrl {

    @Value("mongoose.development")
    dbInfo: { host: string, name: string };

    getHost = () => this.dbInfo.host;
    getName = () => this.dbInfo.name;

    toString() {
        return "mongodb://" + this.getHost() + "/" + this.getName();
    }
}

@Service()
export class MongooseService {

    static resource: Mongoose.Connection;

    getResource = (): Mongoose.Connection => MongooseService.resource;

    /**
     *
     * @returns {Promise<Mongoose.Connection>}
     */
    static async connect(): Promise<Mongoose.Connection> {

        if (MongooseService.resource) {
            return Promise.resolve(MongooseService.resource);
        }

        $log.debug("new MongooseUrl().toString()", new MongooseUrl().toString());
        const db = await Mongoose.connect(new MongooseUrl().toString());

        MongooseService.resource = db;

        return db;
    }
}