import {InjectorService} from "@tsed/common";
import {inject} from "@tsed/testing";
import {expect} from "chai";
import {Sinon} from "../../../test/tools";
import {Calendar} from "../../models/calendars/Calendar";
import {CalendarsService} from "./CalendarsService";

describe("CalendarsService", () => {

    describe("without IOC", () => {
        before(() => {
            this.model = {
                find: Sinon.stub().returns({
                    exec: Sinon.stub().returns(Promise.resolve([{}]))
                })
            };
            this.calendarsService = new CalendarsService(this.model);
        });

        it("should do something", () => {
            expect(this.calendarsService).to.be.an.instanceof(CalendarsService);
        });

        it("should call model.find method", () => {
            this.model.find.should.have.been.calledWithExactly({});
        });
    });

    describe("via InjectorService to mock other service", () => {
        before(inject([InjectorService], (injectorService: InjectorService) => {
            this.model = {
                find: Sinon.stub().returns({
                    exec: Sinon.stub().returns(Promise.resolve([{}]))
                })
            };

            const locals = new Map<any, any>();
            locals.set(Calendar, this.model);

            this.calendarsService = injectorService.invoke<CalendarsService>(CalendarsService, locals);
        }));

        it("should do something", () => {
            expect(this.calendarsService).to.be.an.instanceof(CalendarsService);
        });

        it("should call model.find method", () => {
            this.model.find.should.have.been.calledWithExactly({});
        });
    });

});