import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { AccountEntity } from "./account.entity";
import { TaskEntity } from "./task.entity";

@Entity("TaskTag")
export class TaskTagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => TaskEntity, task => task.tags)
    task: TaskEntity;

    @Column({ nullable: false })
    name: string;
}
