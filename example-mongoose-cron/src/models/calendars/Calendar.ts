import {Enum, IgnoreProperty, Pattern, Property, Required} from "@tsed/common";
import {Model} from "@tsed/mongoose";

@Model()
export class Calendar {
  @IgnoreProperty()
  _id: string;

  @Property()
  @Required()
  @Enum("test", "test2")
  name: string;

  @Property()
  @Pattern(/romain|lili/)
  owner: string;
}