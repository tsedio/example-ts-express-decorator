
import {Service} from "ts-express-decorators";
import MemoryStorage from './MemoryStorage';

export interface ICalendar {
    id: string;
    name: string;
}

@Service()
export default class CalendarsService {

    constructor(
        private memoryStorage: MemoryStorage
    ) {
        this.memoryStorage.set('calendars', require('./../resources/calendars.json'));
    }

    /**
     * Find a calendar by his ID.
     * @param id
     * @returns {undefined|ICalendar}
     */
    public find(id: string) {
        const calendars: ICalendar[] = this.query();
        return calendars.find((value: ICalendar) => value.id === id);
    }

    /**
     * Create a new Calendar
     * @param name
     * @returns {{id: any, name: string}}
     */
    public create(name: string){
        const calendar = {id: require('node-uuid').v4(), name: name};
        const calendars = this.memoryStorage.get<ICalendar[]>('calendars');

        calendars.push(calendar);

        this.memoryStorage.set('calendars', calendars);

        return calendar;
    }

    /**
     *
     * @returns {ICalendar[]}
     */
    public query(): ICalendar[] {
        return this.memoryStorage.get<ICalendar[]>("calendars");
    }

    /**
     *
     * @param calendar
     * @returns {ICalendar}
     */
    public update(calendar: ICalendar): ICalendar {

        const calendars = this.query();

        const index = calendars.findIndex((value: ICalendar) => value.id === calendar.id)

        calendars[index] = calendar;

        this.memoryStorage.set('calendars', calendars);

        return calendar;
    }
}