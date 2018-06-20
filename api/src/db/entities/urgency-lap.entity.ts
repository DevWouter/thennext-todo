import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated } from "typeorm";
import { AccountEntity } from "./account.entity";

/**
 * Entity that is uses to shift the score.
 */
@Entity("UrgencyLap")
export class UrgencyLapEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * A unique identifier that can be used to find a taskList.
     */
    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    @ManyToOne(type => AccountEntity, account => account.urgencyLaps, { onDelete: "CASCADE" })
    owner: AccountEntity;

    /**
     * From which day should this urgency modifier be in effect.
     */
    @Column({
        type: "decimal",
        precision: 7, scale: 3
    })
    fromDay: number;

    /**
     * How much urgency will each day generate.
     */
    @Column({
        type: "decimal",
        precision: 7, scale: 3
    })
    urgencyModifier: number;
}
