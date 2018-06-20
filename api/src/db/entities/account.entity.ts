import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from "typeorm";
import { AccountSettingsEntity } from "./account-settings.entity";
import { SessionEntity } from "./session.entity";
import { ScoreShiftEntity } from ".";
import { TaskTimeLapEntity } from "./task-time-lap.entity";
import { TaskListRightEntity } from "./task-list-right.entity";
import { UrgencyLapEntity } from "./urgency-lap.entity";

@Entity("Account")
export class AccountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    @Column({ length: 500 })
    email: string;

    /**
     * Each user has a display name with which it identifies.
     */
    @Column({ length: 120 })
    displayName: string;

    @Column({ length: 500 })
    password_hash: string;

    @OneToOne(type => AccountSettingsEntity, accountSettings => accountSettings.account, { cascadeAll: true, onDelete: "CASCADE" })
    accountSettings: AccountSettingsEntity;

    @OneToMany(type => TaskListRightEntity, taskList => taskList.account, { cascadeInsert: true })
    rights: TaskListRightEntity[];

    @OneToMany(type => SessionEntity, session => session.account)
    sessions: SessionEntity[];

    @OneToMany(type => ScoreShiftEntity, scoreShift => scoreShift.owner, { cascadeInsert: true })
    scoreShifts: ScoreShiftEntity[];

    @OneToMany(type => TaskTimeLapEntity, timeLap => timeLap.task)
    timeLaps: TaskTimeLapEntity[];

    @OneToMany(type => UrgencyLapEntity, urgencyLap => urgencyLap.owner)
    urgencyLaps: UrgencyLapEntity[];
}
