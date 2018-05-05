import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from "typeorm";
import { TaskListEntity } from "./task-list.entity";
import { ChecklistItemEntity } from "./checklist-item.entity";
import { TaskRelationEntity } from "./task-relation.entity";
import { TaskTimeLapEntity } from "./task-time-lap.entity";

export enum TaskStatus {
    todo = "todo",
    active = "active",
    done = "done",
}

@Entity("Task")
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 36, unique: true })
    @Generated("uuid")
    uuid: string;

    @ManyToOne(type => TaskListEntity, taskList => taskList.tasks, { onDelete: "CASCADE" })
    taskList: TaskListEntity;

    @Column({ nullable: false })
    title: string;

    @Column("text", { nullable: false })
    description: string;

    @Column()
    status: TaskStatus;

    @Column("datetime", { nullable: true })
    sleepUntil: Date;

    @Column({ default: 1 })
    nextChecklistOrder: number;

    @Column("datetime")
    createdAt: Date;

    @Column("datetime")
    updatedAt: Date;

    @Column("datetime", { nullable: true })
    completedAt: Date;

    @OneToMany(type => ChecklistItemEntity, checklistItem => checklistItem.task)
    checklistItems: ChecklistItemEntity[];

    @OneToMany(type => TaskRelationEntity, relation => relation.sourceTask)
    sourceInRelations: TaskRelationEntity[];

    @OneToMany(type => TaskRelationEntity, relation => relation.targetTask)
    targetInRelations: TaskRelationEntity[];

    @OneToMany(type => TaskTimeLapEntity, timeLap => timeLap.task)
    timeLaps: TaskTimeLapEntity[];
}
