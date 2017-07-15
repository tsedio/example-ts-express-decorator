import {expect} from "chai";
import {ControllerService} from "ts-express-decorators";
import {inject} from "ts-express-decorators/testing";
import {CalendarCtrl} from "../../../../controllers/calendars/CalendarCtrl";
import {CalendarsService} from "../../../../services/CalendarsService";
import {MemoryStorage} from "../../../../services/MemoryStorage";

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
                find: () => {
                }
            };

            const locals = new Map<any, any>();
            locals.set(CalendarsService, this.calendarsService);

            this.calendarCtrl = controllerService.invoke<CalendarCtrl>(CalendarCtrl, locals);
        }));

        it("should get the service from InjectorService", () => {
            expect(this.calendarCtrl).to.be.an.instanceof(CalendarCtrl);
        });

        it("should have a fake memoryStorage", () => {
            expect(this.calendarCtrl.calendarsService).to.equal(this.calendarsService);
        });
    });

});