import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from "typeorm";
import { AccountEntity } from "./account.entity";
import { TaskEntity } from "./task.entity";
import { TaskListRightEntity } from "./task-list-right.entity";

@Entity("TaskList")
export class TaskListEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * A unique identifier that can be used to find a taskList.
     */
    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @OneToMany(type => TaskListRightEntity, right => right.taskList, { cascade: true })
    @JoinColumn()
    rights: TaskListRightEntity[];

    @OneToMany(type => TaskEntity, task => task.taskList)
    tasks: TaskEntity[];

    @ManyToOne(type => AccountEntity)
    @JoinColumn()
    owner: AccountEntity;

}
