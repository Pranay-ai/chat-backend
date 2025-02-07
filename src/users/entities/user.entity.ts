import { BaseEntity } from "src/common/db-entity/base.entity";
import { Column, Entity } from "typeorm";
import { Url } from "url";

@Entity('users')
export class User extends BaseEntity {

    @Column()
    displayName: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({nullable: true})
    profilePicture: string
}
