import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity('ChecklistItem')
export class ChecklistItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 36, unique: true, nullable: false })
    @Generated('uuid')
    uuid: string;

    @Column()
    checked: boolean;

    @Column({ length: 512, nullable: false })
    title: string;

    @ManyToOne(type => TaskEntity, task => task.checklistItems, { nullable: false })
    task: TaskEntity;
}