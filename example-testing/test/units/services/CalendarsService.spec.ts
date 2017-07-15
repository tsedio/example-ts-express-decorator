import {expect} from "chai";
import {InjectorService} from "ts-express-decorators";
import {inject} from "ts-express-decorators/testing";
import {CalendarsService} from "../../../services/CalendarsService";
import {MemoryStorage} from "../../../services/MemoryStorage";

describe("CalendarsService", () => {

    describe("without IOC", () => {
        before(() => {
            this.calendarsService = new CalendarsService(new MemoryStorage());
        });

        it("should do something", () => {
            expect(this.calendarsService).to.be.an.instanceof(CalendarsService);
        });
    });

    describe("with inject()", () => {
        before(inject([CalendarsService], (calendarsService: CalendarsService) => {
            this.calendarsService = calendarsService;
        }));

        it("should get the service from the inject method", () => {
            expect(this.calendarsService).to.be.an.instanceof(CalendarsService);
        });
    });

    describe("via InjectorService to mock other service", () => {
        before(inject([InjectorService], (injectorService: InjectorService) => {
            this.memoryStorage = {
                set: () => {
                },
                get: () => {

                }
            };

            const locals = new Map<any, any>();
            locals.set(MemoryStorage, this.memoryStorage);

            this.calendarsService = injectorService.invoke<CalendarsService>(CalendarsService, locals);
        }));

        it("should get the service from InjectorService", () => {
            expect(this.calendarsService).to.be.an.instanceof(CalendarsService);
        });

        it("should have a fake memoryStorage", () => {
            expect(this.calendarsService.memoryStorage).to.equal(this.memoryStorage);
        });
    });

});