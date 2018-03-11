import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from 'typeorm';
import { TaskListEntity } from './task-list.entity';
import { ChecklistItemEntity } from './checklist-item.entity'
import { TaskTagEntity } from './task-tag.entity'
import { TaskRelationEntity } from './task-relation.entity'

export enum TaskStatus {
    todo = 'todo',
    active = 'active',
    done = 'done',
}

@Entity('Task')
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 36, unique: true })
    @Generated('uuid')
    uuid: string;

    @ManyToOne(type => TaskListEntity, taskList => taskList.tasks)
    taskList: TaskListEntity;

    @Column({ nullable: false })
    title: string;

    @Column('text', { nullable: false })
    description: string;

    @Column()
    status: TaskStatus;

    @Column('datetime')
    createdAt: Date;

    @Column('datetime')
    updatedAt: Date;

    @Column('datetime')
    completedAt: Date;

    @OneToMany(type => ChecklistItemEntity, checklistItem => checklistItem.task)
    checklistItems: ChecklistItemEntity[];

    @OneToMany(type => TaskTagEntity, tag => tag.task)
    tags: TaskTagEntity[];

    @OneToMany(type => TaskRelationEntity, relation => relation.sourceTask)
    sourceInRelations: TaskRelationEntity[];

    @OneToMany(type => TaskRelationEntity, relation => relation.targetTask)
    targetInRelations: TaskRelationEntity[];
}
