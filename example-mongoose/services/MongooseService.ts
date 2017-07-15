import * as Mongoose from "mongoose";
import {Service} from "ts-express-decorators";
import {Value} from "ts-json-properties";

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

        const db = await Mongoose.createConnection(new MongooseUrl().toString(), {
            useMongoClient: true
        } as any);

        MongooseService.resource = db;

        return db;
    }
}