import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Generated } from 'typeorm';
import { AccountSettingsEntity } from './account-settings.entity';
import { DecaySpeedEntity } from './decay-speed.entity';
import { TagScoreEntity } from './tag-score.entity';
import { ContextEntity } from './context.entity';
import { SessionEntity } from './session.entity';

@Entity('Account')
export class AccountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ length: 500 })
    email: string;

    @Column({ length: 500 })
    password_hash: string;

    @OneToOne(type => AccountSettingsEntity, accountSettings => accountSettings.account, { cascadeAll: true })
    accountSettings: AccountSettingsEntity;

    @OneToMany(type => DecaySpeedEntity, decaySpeed => decaySpeed.account)
    decaySpeeds: DecaySpeedEntity[];

    @OneToMany(type => TagScoreEntity, tagScore => tagScore.account)
    tagScores: TagScoreEntity[];

    @OneToMany(type => ContextEntity, context => context.owner)
    contexts: ContextEntity[];

    @OneToMany(type => SessionEntity, session => session.account)
    sessions: SessionEntity[];
}
