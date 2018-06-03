import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from "typeorm";
import { AccountEntity } from "./account.entity";
import { TaskListEntity } from "./task-list.entity";

@Entity("TaskListShareToken")
export class TaskListShareTokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    @Column("varchar")
    @Generated("uuid")
    token: string;

    @ManyToOne(type => TaskListEntity)
    @JoinColumn()
    taskList: TaskListEntity;
}
