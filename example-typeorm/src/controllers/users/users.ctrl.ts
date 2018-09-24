import {BodyParams, Controller, Post, Get} from "@tsed/common";
import {User} from "../../entity/user";
import {UsersService} from "../../services/users.service";

@Controller("/users")
export class UsersCtrl {

  constructor(private usersService: UsersService) {

  }

  @Post("/")
  create(@BodyParams() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get("/")
  async getList(): Promise<User[]> {
    return this.usersService.find();
  }
}