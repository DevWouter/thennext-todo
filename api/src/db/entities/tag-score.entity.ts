import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("TagScore")
export class TagScoreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => AccountEntity, account => account.tagScores, { onDelete: "CASCADE" })
    account: AccountEntity;

    @Column()
    name: string;

    @Column("float")
    value: number;
}
