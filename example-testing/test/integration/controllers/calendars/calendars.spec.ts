import {expect} from "chai";
import * as SuperTest from "supertest";
import {ExpressApplication} from "ts-express-decorators";
import {bootstrap, Done, inject} from "ts-express-decorators/testing";
import {Server} from "../../../../Server";

describe("Calendars", () => {

    // bootstrap your expressApplication in first
    before(bootstrap(Server));

    // then run your test
    describe("GET /rest/calendars", () => {
        it("should return all calendars", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

            SuperTest(expressApplication)
                .get("/rest/calendars")
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("array");

                    done();
                });

        }));
    });

});