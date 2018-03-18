import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("Session")
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => AccountEntity, account => account.sessions)
    account: AccountEntity;

    @Column({ nullable: false, unique: true })
    token: string;

    @Column("datetime")
    created_on: Date;

    @Column("datetime")
    expire_on: Date;
}
