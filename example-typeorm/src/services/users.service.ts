import {IComponentScanned, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {$log} from "ts-log-debug";
import {Connection} from "typeorm";
import {User} from "../entity/user";

@Service()
export class UsersService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {
  }

  $onInit(): Promise<any> | void {
    $log.warn("All services is ready");
  }

  $beforeRoutesInit(): Promise<any> | void {
    $log.warn("Controllers and routes isn't mounted");
  }

  $onRoutesInit(components: IComponentScanned[]): Promise<any> | void {
    $log.warn("Controllers and routes are being built");

  }

  $afterRoutesInit(): Promise<any> | void {
    $log.warn("Controllers and routes are built");
    this.connection = this.typeORMService.get();
    console.log("this.connection =>", !!this.connection);
  }

  $onServerReady(): Promise<any> | void {
    $log.warn("Server is ready and listen the port");
  }

  async create(user: User): Promise<User> {
    await this.connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    return user;
  }

  async find(): Promise<User[]> {
    const users = await this.connection.manager.find(User);
    console.log("Loaded users: ", users);

    return users;
  }

}