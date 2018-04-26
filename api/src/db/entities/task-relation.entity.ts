import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne, Generated } from "typeorm";
import { AccountEntity } from "./account.entity";
import { TaskEntity } from "./task.entity";

export enum TaskRelationType {
    blocks = "blocks",
}

@Entity("TaskRelation")
export class TaskRelationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { unique: true })
    @Generated("uuid")
    uuid: string;

    @ManyToOne(type => TaskEntity, task => task.sourceInRelations, { onDelete: "CASCADE" })
    sourceTask: TaskEntity;

    @ManyToOne(type => TaskEntity, task => task.targetInRelations, { onDelete: "CASCADE" })
    targetTask: TaskEntity;

    @Column()
    relationType: TaskRelationType;
}
