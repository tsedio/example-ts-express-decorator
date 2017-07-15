import {Service} from "ts-express-decorators";
import {MemoryStorage} from "./MemoryStorage";

export interface IUser {
    _id: string;
    name: {
        first: string;
        last: string;
    },
    password: string,
    email: string;
    phone: string;
    address: string;
}

@Service()
export class UsersService {

    constructor(private memoryStorage: MemoryStorage) {
        this.memoryStorage.set("users", require("./../resources/users.json"));
    }

    /**
     * Find a user by his ID.
     * @param id
     * @returns {undefined|IUser}
     */
    public find(id: string) {
        const users: IUser[] = this.query();
        return users.find((value: IUser) => value._id === id);
    }

    public findByEmail(email: string) {
        const users: IUser[] = this.query();
        return users.find((value: IUser) => value.email === email);
    }

    public findByCredential(email: string, password: string) {
        const users: IUser[] = this.query();
        return users.find((value: IUser) => value.email === email && value.password === password);
    }

    /**
     * Create a new User
     * @param name
     * @returns {{id: any, name: string}}
     */
    public create(user: IUser) {
        user._id = require("node-uuid").v4();
        const users = this.memoryStorage.get<IUser[]>("users");

        users.push(user);

        this.memoryStorage.set("users", users);

        return user;
    }

    /**
     *
     * @returns {IUser[]}
     */
    public query(): IUser[] {
        return this.memoryStorage.get<IUser[]>("users");
    }

    /**
     *
     * @param user
     * @returns {IUser}
     */
    public update(user: IUser): IUser {

        const users = this.query();

        const index = users.findIndex((value: IUser) => value._id === user._id);

        users[index] = user;

        this.memoryStorage.set("users", users);

        return user;
    }
}