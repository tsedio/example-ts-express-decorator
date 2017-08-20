import {ControllerService} from "ts-express-decorators";
import {inject} from "ts-express-decorators/testing";
import {CalendarCtrl} from "../../../../controllers/calendars/CalendarCtrl";
import {CalendarsService} from "../../../../services/CalendarsService";
import {MemoryStorage} from "../../../../services/MemoryStorage";
import {expect, Sinon} from "../../../tools";


describe("CalendarCtrl", () => {

    describe("without IOC", () => {
        before(() => {
            this.calendarsCtrl = new CalendarCtrl(new CalendarsService(new MemoryStorage()));
        });

        it("should do something", () => {
            expect(this.calendarsCtrl).to.be.an.instanceof(CalendarCtrl);
        });
    });

    describe("via InjectorService to mock other service", () => {
        before(inject([ControllerService], (controllerService: ControllerService) => {

            this.calendarsService = {
                find: Sinon.stub().returns(Promise.resolve({id: "1"}))
            };

            const locals = new Map<any, any>();
            locals.set(CalendarsService, this.calendarsService);

            this.calendarCtrl = controllerService.invoke<CalendarCtrl>(CalendarCtrl, locals);
            this.result = this.calendarCtrl.get("1");
            return this.result;
        }));

        it("should get the service from InjectorService", () => {
            expect(this.calendarCtrl).to.be.an.instanceof(CalendarCtrl);
        });

        it("should have a fake memoryStorage", () => {
            expect(this.calendarCtrl.calendarsService).to.equal(this.calendarsService);
        });

        it("should have been called the CalendarService.find() method", () => {
            this.calendarsService.find.should.be.calledWithExactly("1");
        });

        it("should return the calendar", () => {
            return this.result.should.eventually.deep.equal({id: "1"});
        });
    });

});