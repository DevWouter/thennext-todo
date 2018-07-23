import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Generated } from "typeorm";
import { AccountEntity } from "./account.entity";
import { TaskListEntity } from "./task-list.entity";

export enum AccessRight {
    none = "none",
    default = "default",
    owner = "owner",
}

@Entity("TaskListRight")
export class TaskListRightEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    @Column()
    access: AccessRight;

    @ManyToOne(type => AccountEntity, account => account.rights)
    @JoinColumn()
    account: AccountEntity;

    @ManyToOne(type => TaskListEntity, tasklist => tasklist.rights, { onDelete: "CASCADE" })
    @JoinColumn()
    taskList: TaskListEntity;
}
