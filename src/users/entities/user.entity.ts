import { BaseEntity } from "src/common/db-entity/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
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

    @Column({default: false})
    emailVerified: boolean;

}
