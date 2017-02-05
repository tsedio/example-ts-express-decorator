

import {inject, Done, bootstrap} from "ts-express-decorators/testing";
import {expect} from "chai";
import {ExpressApplication, ServerLoader} from "ts-express-decorators";
import * as SuperTest from "supertest";
import {Server} from "../Server";

describe('Rest :', () => {

    beforeEach(bootstrap(Server));

    it('should respond', inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

        SuperTest(expressApplication)
            .get('/rest')
            .expect(200)
            .end((err, response: any) => {

                if (err) {
                    throw (err);
                }

                let obj = JSON.parse(response.text);

                expect(obj).to.be.an('array');

                done();
            });

    }));

});