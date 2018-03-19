import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("AccountSettings")
export class AccountSettingsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => AccountEntity, accountEntity => accountEntity.accountSettings, { cascadeInsert: true, onDelete: "CASCADE" })
    @JoinColumn()
    account: AccountEntity;

    @Column()
    scrollToNewTasks: boolean;

    @Column()
    hideScoreInTaskList: boolean;

    @Column()
    defaultWaitUntil: string;

    @Column("float")
    urgencyPerDay: number;

    @Column("float")
    urgencyWhenActive: number;

    @Column("float")
    urgencyWhenDescription: number;

    @Column("float")
    urgencyWhenBlocking: number;

    @Column("float")
    urgencyWhenBlocked: number;

    static setDefaultValues(settings: AccountSettingsEntity): void {
        settings.scrollToNewTasks = true;
        settings.hideScoreInTaskList = false;
        settings.defaultWaitUntil = "07:00";
        settings.urgencyPerDay = 2.0;
        settings.urgencyWhenActive = 4.0;
        settings.urgencyWhenDescription = 1.0;
        settings.urgencyWhenBlocking = 8.0;
        settings.urgencyWhenBlocked = 5.0;
    }
}
