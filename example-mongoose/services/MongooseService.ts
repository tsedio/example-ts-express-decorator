import * as Mongoose from "mongoose";
import {Service} from 'ts-express-decorators';
import {Value} from 'ts-json-properties';


class MongooseUrl {

    @Value('mongoose.development')
    dbInfo: {host: string, name: string};

    getHost = () => this.dbInfo.host;
    getName = () => this.dbInfo.name;

    toString(){
        console.log(this.dbInfo);
        return 'mongodb://' + this.getHost() + '/' + this.getName();
    }
}

@Service()
export default class MongooseService {

    static resource: Mongoose.Connection;

    getResource = (): Mongoose.Connection => MongooseService.resource;

    /**
     *
     * @returns {Promise<Mongoose.Connection>}
     */
    static connect(): Promise<Mongoose.Connection> {

        return new Promise<Mongoose.Connection>((resolve, reject) => {

            if(MongooseService.resource) {
                resolve(MongooseService.resource);
            }

            (<any>Mongoose).Promise = global.Promise;

            Mongoose.connect(new MongooseUrl().toString());

            const db = Mongoose.connection;

            db.on('error', reject);

            db.once('open', () =>{
                MongooseService.resource = db;
                resolve(db);
            });

        });
    }
}