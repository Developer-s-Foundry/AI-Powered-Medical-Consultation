import { Column, ManyToOne } from "typeorm";
import { User } from "./user";


export class ResetPasswordToken {

    @Column()
    token_hash!: string;

    @Column({ default: false })
    isUsed!: boolean;

    @Column()
    expiresAt!: Date;

    @ManyToOne(() => User, user => user.resetPasswordTokens)
    user!: User;
    
}