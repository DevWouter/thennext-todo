import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Generated } from "typeorm";
import { TaskListEntity } from "./task-list.entity";

@Entity("TaskListShareToken")
export class TaskListShareTokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    /**
     * The token that can be given to a user so it can granted access.
     */
    @Column("varchar")
    token: string;

    @ManyToOne(type => TaskListEntity)
    @JoinColumn()
    taskList: TaskListEntity;
}
