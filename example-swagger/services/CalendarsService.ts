import {Service} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Calendar} from "../models/Calendar";

@Service()
export class CalendarsService {

    constructor() {

        Calendar
            .find({})
            .exec()
            .then((calendars) => {
                if (calendars.length === 0) {
                    Calendar.create(...require("./../resources/calendars.json"));
                }
            })
            .catch(err => console.error(err));

    }

    /**
     * Find a calendar by his ID.
     * @param id
     * @returns {undefined|Calendar}
     */
    async find(id: string): Promise<Calendar> {
        $log.debug("Search a calendar from ID", id);
        const calendar = await Calendar.findById(id).exec();

        $log.debug("Found", calendar);
        return calendar;
    }

    /**
     *
     * @param calendar
     * @returns {Promise<TResult|TResult2|Calendar>}
     */
    async save(calendar: Calendar): Promise<Calendar> {
        $log.debug({message: "Validate calendar", calendar});

        await calendar.validate();
        $log.debug({message: "Save calendar", calendar});
        await calendar.update(calendar, {upsert: true});

        $log.debug({message: "Calendar saved", calendar});

        return calendar;
    }

    /**
     *
     * @returns {Calendar[]}
     */
    async query(options = {}): Promise<Calendar[]> {
        return Calendar.find(options).exec();
    }

    /**
     *
     * @param id
     * @returns {Promise<Calendar>}
     */
    async remove(id: string): Promise<void> {
        await Calendar.findById(id).remove().exec();
    }
}