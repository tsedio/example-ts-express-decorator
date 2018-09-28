import {Service} from "@tsed/common";
import {CalendarsService} from "../calendars/CalendarsService";

@Service()
export class CronService {
  constructor(private calendarsService: CalendarsService) {
      console.log('CRONSERVICE')
  }

  async $onCronReady() {
    console.log("========> CRON");
    const calendars = await this.calendarsService.query();

    console.log(calendars);
  }
}