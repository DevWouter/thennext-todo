import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskRelationEntity } from "../db/entities";

@injectable()
export class TaskRelationRepository {
    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskRelationEntity> {
        return (await this.db())
            .createQueryBuilder(TaskRelationEntity, "relation")
            .innerJoinAndSelect("relation.sourceTask", "sourceTask")
            .innerJoinAndSelect("relation.targetTask", "targetTask")
            .innerJoin("sourceTask.taskList", "sourceTaskList")
            .innerJoin("sourceTaskList.rights", "sourceRight")
            .innerJoin("sourceRight.account", "sourceAccount")
            .innerJoin("targetTask.taskList", "targetTaskList")
            .innerJoin("targetTaskList.rights", "targetRight")
            .innerJoin("targetRight.account", "targetAccount")
            .where("relation.uuid = :uuid")
            .where("sourceAccount.id = :sourceAccountId")
            .andWhere("targetAccount.id = :targetAccountId")
            .setParameters({
                uuid: uuid,
                sourceAccountId: account.id,
                targetAccountId: account.id
            })
            .getOne();
    }

    async byId(id: number): Promise<TaskRelationEntity> {
        return (await this.db())
            .createQueryBuilder(TaskRelationEntity, "relation")
            .innerJoinAndSelect("relation.sourceTask", "sourceTask")
            .innerJoinAndSelect("relation.targetTask", "targetTask")
            .where("relation.id = :id", { uuid: id })
            .getOne();
    }

    async of(account: AccountEntity): Promise<TaskRelationEntity[]> {
        return (await this.db())
            .createQueryBuilder(TaskRelationEntity, "relation")
            .innerJoinAndSelect("relation.sourceTask", "sourceTask")
            .innerJoinAndSelect("relation.targetTask", "targetTask")
            .innerJoin("sourceTask.taskList", "sourceTaskList")
            .innerJoin("sourceTaskList.rights", "sourceRight")
            .innerJoin("sourceRight.account", "sourceAccount")
            .innerJoin("targetTask.taskList", "targetTaskList")
            .innerJoin("targetTaskList.rights", "targetRight")
            .innerJoin("targetRight.account", "targetAccount")
            .where("sourceAccount.id = :sourceAccountId")
            .andWhere("targetAccount.id = :targetAccountId")
            .setParameters({
                sourceAccountId: account.id,
                targetAccountId: account.id
            })
            .getMany();
    }

    async update(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskRelationEntity, entity);
    }

    async create(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskRelationEntity, entity);
    }

    async destroy(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(TaskRelationEntity, entity);
    }
}
