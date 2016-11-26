
import {inject} from "ts-express-decorators/testing";
import {expect} from "chai";
import CalendarsService from '../../example-testing/services/CalendarsService';

describe('CalendarsService:', () => {

    it('should do inject service', inject([CalendarsService],
        (calendarsService: CalendarsService) => {


            expect(calendarsService).to.be.an.instanceof(CalendarsService);


        }
    ));
});