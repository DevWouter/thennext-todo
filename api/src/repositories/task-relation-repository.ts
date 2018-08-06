import { injectable, inject } from "inversify";

import { AccountEntity, TaskRelationEntity } from "../db/entities";
import { Database } from "./database";

@injectable()
export class TaskRelationRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskRelationEntity> {
        throw new Error("Not yet implemented");

        // return (await this.db())
        //     .createQueryBuilder(TaskRelationEntity, "relation")
        //     .innerJoinAndSelect("relation.sourceTask", "sourceTask")
        //     .innerJoinAndSelect("relation.targetTask", "targetTask")
        //     .innerJoin("sourceTask.taskList", "sourceTaskList")
        //     .innerJoin("sourceTaskList.rights", "sourceRight")
        //     .innerJoin("sourceRight.account", "sourceAccount")
        //     .innerJoin("targetTask.taskList", "targetTaskList")
        //     .innerJoin("targetTaskList.rights", "targetRight")
        //     .innerJoin("targetRight.account", "targetAccount")
        //     .where("relation.uuid = :uuid")
        //     .where("sourceAccount.id = :sourceAccountId")
        //     .andWhere("targetAccount.id = :targetAccountId")
        //     .setParameters({
        //         uuid: uuid,
        //         sourceAccountId: account.id,
        //         targetAccountId: account.id
        //     })
        //     .getOne();
    }

    async byId(id: number): Promise<TaskRelationEntity> {
        throw new Error("Not yet implemented");

        // return (await this.db())
        //     .createQueryBuilder(TaskRelationEntity, "relation")
        //     .innerJoinAndSelect("relation.sourceTask", "sourceTask")
        //     .innerJoinAndSelect("relation.targetTask", "targetTask")
        //     .where("relation.id = :id", { uuid: id })
        //     .getOne();
    }

    async of(account: AccountEntity): Promise<TaskRelationEntity[]> {
        throw new Error("Not yet implemented");

        // return (await this.db())
        //     .createQueryBuilder(TaskRelationEntity, "relation")
        //     .innerJoinAndSelect("relation.sourceTask", "sourceTask")
        //     .innerJoinAndSelect("relation.targetTask", "targetTask")
        //     .innerJoin("sourceTask.taskList", "sourceTaskList")
        //     .innerJoin("sourceTaskList.rights", "sourceRight")
        //     .innerJoin("sourceRight.account", "sourceAccount")
        //     .innerJoin("targetTask.taskList", "targetTaskList")
        //     .innerJoin("targetTaskList.rights", "targetRight")
        //     .innerJoin("targetRight.account", "targetAccount")
        //     .where("sourceAccount.id = :sourceAccountId")
        //     .andWhere("targetAccount.id = :targetAccountId")
        //     .setParameters({
        //         sourceAccountId: account.id,
        //         targetAccountId: account.id
        //     })
        //     .getMany();
    }

    async update(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskRelationEntity, entity);
    }

    async create(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskRelationEntity, entity);
    }

    async destroy(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(TaskRelationEntity, entity);
    }
}
