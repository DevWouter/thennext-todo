import { Entity, Column, PrimaryGeneratedColumn, Generated, ManyToOne } from "typeorm";
import { TaskEntity } from "./task.entity";
import { AccountEntity } from "./account.entity";

/**
 * Contains a period of duration that was worked on a task.
 */
@Entity("TaskTimeLap")
export class TaskTimeLapEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 36, unique: true })
    @Generated("uuid")
    uuid: string;

    @ManyToOne(type => TaskEntity, task => task.timeLaps, { nullable: false, onDelete: "CASCADE" })
    task: TaskEntity;

    @ManyToOne(type => AccountEntity, account => account.timeLaps, { nullable: false, onDelete: "CASCADE" })
    owner: AccountEntity;

    @Column("datetime")
    startTime: Date;

    @Column("datetime", { nullable: true })
    endTime: Date;
}
