import {Allow, Required} from "@tsed/common";
import {Column, Entity, ObjectIdColumn} from "typeorm";

@Entity("User")
export class User {

  @ObjectIdColumn()
  id: number;

  @Required()
  @Allow("", null)
  @Column()
  email: string;

  @Required()
  @Allow("", null)
  @Column()
  password: string;
}
