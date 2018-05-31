import { injectable } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskRelationEntity } from "../db/entities";

@injectable()
export class TaskRelationService {
    constructor(
        private readonly db: Connection
    ) { }

    byUuid(uuid: string, account: AccountEntity): Promise<TaskRelationEntity> {
        // this function requires the account to ensure we have ownership.
        return this.db
            .createQueryBuilder(TaskRelationEntity, "relation")
            .innerJoinAndSelect("relation.sourceTask", "sourceTask")
            .innerJoinAndSelect("relation.targetTask", "targetTask")
            .innerJoin("sourceTask.taskList", "sourceTaskList")
            .innerJoin("sourceTaskList.rights", "sourceRight")
            .innerJoin("sourceRight.account", "sourceAccount")
            .innerJoin("targetTask.taskList", "targetTaskList")
            .innerJoin("targetTaskList.rights", "targetRight")
            .innerJoin("targetRight.account", "targetAccount")
            .where("relation.uuid = :uuid", { uuid: uuid })
            .andWhere("sourceAccount.id = :id", { id: account.id })
            .andWhere("targetAccount.id = :id", { id: account.id })
            .getOne();
    }

    byId(id: number): Promise<TaskRelationEntity> {
        return this.db
            .createQueryBuilder(TaskRelationEntity, "relation")
            .innerJoinAndSelect("relation.sourceTask", "sourceTask")
            .innerJoinAndSelect("relation.targetTask", "targetTask")
            .where("relation.id = :id", { uuid: id })
            .getOne();
    }

    of(account: AccountEntity): Promise<TaskRelationEntity[]> {
        return this.db
            .createQueryBuilder(TaskRelationEntity, "relation")
            .innerJoinAndSelect("relation.sourceTask", "sourceTask")
            .innerJoinAndSelect("relation.targetTask", "targetTask")
            .innerJoin("sourceTask.taskList", "sourceTaskList")
            .innerJoin("sourceTaskList.rights", "sourceRight")
            .innerJoin("sourceRight.account", "sourceAccount")
            .innerJoin("targetTask.taskList", "targetTaskList")
            .innerJoin("targetTaskList.rights", "targetRight")
            .innerJoin("targetRight.account", "targetAccount")
            .where("sourceAccount.id = :id", { id: account.id })
            .andWhere("targetAccount.id = :id", { id: account.id })
            .getMany();
    }

    update(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskRelationEntity, entity);
    }

    create(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskRelationEntity, entity);
    }

    destroy(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(TaskRelationEntity, entity);
    }
}
