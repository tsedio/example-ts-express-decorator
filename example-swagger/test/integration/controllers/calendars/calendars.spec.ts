import {ExpressApplication} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Done} from "ts-express-decorators/lib/testing";
import {bootstrap, inject} from "ts-express-decorators/testing";
import {Server} from "../../../../Server";

describe("Calendars", () => {

    // bootstrap your expressApplication in first
    before(bootstrap(Server));
    before(inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Done) => {

        this.app = SuperTest(expressApplication);
        this.agentApp = SuperTest.agent(expressApplication);

        this.done = (done) => (err, response: any) => {
            this.err = err;
            this.response = response;
            done();
        };

        this.agentApp
            .post("/rest/passport/login")
            .send({email: "amy.riley@undefined.io", password: "583538ea97489c137ad54db5"})
            .expect(200)
            .end(done);

    }));

    // then run your test
    describe("GET /rest/calendars", () => {

        describe("when user isn't logged", () => {
            before((done) => {
                this.app
                    .get("/rest/calendars")
                    .expect(403)
                    .end(this.done(done));
            });
            it("should respond 403", () => {
                expect(this.response.forbidden).to.eq(true);
                expect(this.response.text).to.eq("Forbidden");
            });
        });

        describe("when user is logged", () => {
            before((done) => {
                this.agentApp
                    .get("/rest/calendars")
                    .expect(200)
                    .end(this.done(done));
            });
            it("should respond 200", () => {
                expect(this.response.ok).to.eq(true);
                expect(JSON.parse(this.response.text)).to.deep.eq([
                    {"id": "1", "name": "Sexton Berg"},
                    {"id": "2", "name": "Etta Gonzalez"},
                    {"id": "3", "name": "Hall Leon"},
                    {"id": "4", "name": "Gentry Rowe"},
                    {"id": "5", "name": "Janelle Adams"},
                    {"id": "6", "name": "Smith Norris"},
                    {"id": "7", "name": "Robertson Crane"}
                ]);
            });
        });
    });

    // then run your test
    describe("DELETE /rest/calendars", () => {
        before((done) => {
            this.app
                .delete("/rest/calendars")
                .send({id: "1"})
                .expect(403)
                .end(this.done(done));
        });
        it("should respond 403", () => {
            expect(this.response.text).to.eq("Forbidden");
        });
    });

});