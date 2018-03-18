import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("DecaySpeed")
export class DecaySpeedEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => AccountEntity, account => account.decaySpeeds)
    account: AccountEntity;

    @Column("float")
    from: number;

    @Column("float")
    coefficient: number;
}
