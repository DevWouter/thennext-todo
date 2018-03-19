import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { AccountEntity } from "./account.entity";
import { TaskEntity } from "./task.entity";

export enum TaskEventType {
    delay = "delay",
}

@Entity("TaskEvent")
export class TaskEventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => TaskEntity, task => task.tags, { onDelete: "CASCADE" })
    task: TaskEntity;

    @Column({ nullable: false })
    eventType: TaskEventType;

    @Column("datetime")
    stamp: Date;
}
