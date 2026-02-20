import { Column, OneToMany } from "typeorm";
import { User } from "./user";


export class Role {
    @Column()
    name!: string;

    @OneToMany(() => User, user => user.role)
    users!: User[];
}
