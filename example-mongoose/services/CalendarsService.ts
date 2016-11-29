
import {Service} from "ts-express-decorators";
import MemoryStorage from './MemoryStorage';
import {Calendar, ICalendar} from '../models/Calendar';

@Service()
export default class CalendarsService {

    constructor(

    ) {

        Calendar
            .find({})
            .exec()
            .then((calendars) =>{
                if(calendars.length === 0) {
                    Calendar.create(...require('./../resources/calendars.json'));
                }
            })
            .catch(err => console.error(err));

    }

    /**
     * Find a calendar by his ID.
     * @param id
     * @returns {undefined|ICalendar}
     */
    public find = (id: string) : Promise<ICalendar> =>
        Calendar.findById(id).exec();


    /**
     * Create a new Calendar
     * @param name
     * @returns {{id: any, name: string}}
     */
    public create = (name: string): Promise<ICalendar> =>
        Calendar.create({name: name});


    /**
     *
     * @returns {ICalendar[]}
     */
    public query = (): Promise<ICalendar[]> =>
        Calendar.find().exec();

    /**
     *
     * @param calendar
     * @returns {ICalendar}
     */
    public update(calendar: ICalendar): Promise<ICalendar> {

        return Calendar
            .findById(calendar._id)
            .exec()
            .then<ICalendar>((calendarResult) => {

                delete calendar._id;
                Object.assign(calendarResult, calendar);

                return calendarResult.save();
            });
    }
}