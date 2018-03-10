import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { TaskEntity } from './task.entity';

export enum TaskRelationType {
    blocks = 'blocks',
}

@Entity('TaskRelation')
export class TaskRelationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => TaskEntity, task => task.sourceInRelations)
    sourceTask: TaskEntity;

    @ManyToOne(type => TaskEntity, task => task.targetInRelations)
    targetTask: TaskEntity;

    @Column()
    relationType: TaskRelationType;
}
