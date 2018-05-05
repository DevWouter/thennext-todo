import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from "typeorm";
import { AccountSettingsEntity } from "./account-settings.entity";
import { SessionEntity } from "./session.entity";
import { TaskListEntity } from "./task-list.entity";
import { ScoreShiftEntity } from ".";
import { TaskTimeLapEntity } from "./task-time-lap.entity";

@Entity("Account")
export class AccountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    @Column({ length: 500 })
    email: string;

    @Column({ length: 500 })
    password_hash: string;

    @OneToOne(type => AccountSettingsEntity, accountSettings => accountSettings.account, { cascadeAll: true, onDelete: "CASCADE" })
    accountSettings: AccountSettingsEntity;

    @OneToMany(type => TaskListEntity, taskList => taskList.owner, { cascadeInsert: true })
    taskLists: TaskListEntity[];

    @OneToMany(type => SessionEntity, session => session.account)
    sessions: SessionEntity[];

    @OneToMany(type => ScoreShiftEntity, scoreShift => scoreShift.owner, { cascadeInsert: true })
    scoreShifts: ScoreShiftEntity[];

    @OneToMany(type => TaskTimeLapEntity, timeLap => timeLap.task)
    timeLaps: TaskTimeLapEntity[];
}
