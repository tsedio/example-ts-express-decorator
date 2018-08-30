import {Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {Connection} from "typeorm";
import {User} from "../entity/User";

@Service()
export class UsersService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {

  }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("db1");
  }

  async create(user: User): Promise<User> {
    try {
      console.log(user);
      // Then save
      await this.connection.mongoManager.save(user);
      console.log("Saved a new user with id: " + user.id);

      return user;
    } catch (er) {
      console.error(er);
    }
  }

  async find(): Promise<User[]> {
    const users = await this.connection.mongoManager.find(User);
    console.log("Loaded users: ", users);

    return users;
  }

}