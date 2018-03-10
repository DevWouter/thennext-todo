import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from 'typeorm';
import { AccountEntity } from './account.entity';
import { TaskEntity } from './task.entity';

@Entity('Context')
export class ContextEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * A unique identifier that can be used to find a context.
     */
    @Column('varchar', { unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column()
    primary: boolean;

    @ManyToOne(type => AccountEntity, account => account.contexts)
    @JoinColumn()
    owner: AccountEntity;

    @OneToMany(type => TaskEntity, task => task.context)
    tasks: TaskEntity[];
}
