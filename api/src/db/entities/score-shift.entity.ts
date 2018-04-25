import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated } from "typeorm";
import { AccountEntity } from "./account.entity";

/**
 * Entity that is uses to shift the score.
 */
@Entity("ScoreShift")
export class ScoreShiftEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * A unique identifier that can be used to find a taskList.
     */
    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    @ManyToOne(type => AccountEntity, account => account.scoreShifts, { onDelete: "CASCADE" })
    owner: AccountEntity;

    /**
     * The phrase it will look for.
     */
    @Column({ nullable: false })
    phrase: string;

    /**
     * The adjustment in score.
     */
    @Column({ nullable: false, default: 0 })
    score: number;

    @Column("datetime")
    created_on: Date;

    @Column("datetime")
    updated_on: Date;
}
