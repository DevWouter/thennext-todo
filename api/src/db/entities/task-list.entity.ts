import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from 'typeorm';
import { AccountEntity } from './account.entity';
import { TaskEntity } from './task.entity';

@Entity('TaskList')
export class TaskListEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * A unique identifier that can be used to find a taskList.
     */
    @Column('varchar', { unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column()
    primary: boolean;

    @ManyToOne(type => AccountEntity, account => account.taskLists)
    @JoinColumn()
    owner: AccountEntity;

    @OneToMany(type => TaskEntity, task => task.taskList)
    tasks: TaskEntity[];
}
