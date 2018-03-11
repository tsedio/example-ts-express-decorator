import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {$log} from "ts-log-debug";
import {Calendar} from "../../models/calendars/Calendar";


@Service()
export class CalendarsService {

    constructor(@Inject(Calendar) private calendarModel: MongooseModel<Calendar>) {
        this.reload();
    }

    async reload() {
        return this.calendarModel
            .find({})
            .exec()
            .then((calendars) => {
                if (calendars.length === 0) {
                    this.calendarModel.create(...require("../../../resources/calendars.json"));
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
        const calendar = await this.calendarModel.findById(id).exec();

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

        // const m = new CModel(calendar);
        // console.log(m);
        // await m.update(calendar, {upsert: true});

        const model = new this.calendarModel(calendar);
        $log.debug({message: "Save calendar", calendar});
        await model.save();

        $log.debug({message: "Calendar saved", model});

        return model;
    }

    /**
     *
     * @returns {Calendar[]}
     */
    async query(options = {}): Promise<Calendar[]> {
        return this.calendarModel.find(options).exec();
    }

    /**
     *
     * @param id
     * @returns {Promise<Calendar>}
     */
    async remove(id: string): Promise<Calendar> {
        return await this.calendarModel.findById(id).remove().exec();
    }
}