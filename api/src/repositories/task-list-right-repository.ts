import { injectable, inject } from "inversify";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListRightEntity } from "../db/entities/task-list-right.entity";
import { Connection } from "mysql";
import { Database } from "./database";

@injectable()
export class TaskListRightRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) {
    }

    async update(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db).createEntityManager();
        // return entityManager.save(TaskListRightEntity, entity);
    }

    async create(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db).createEntityManager();
        // return entityManager.save(TaskListRightEntity, entity);
    }

    async destroy(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db).createEntityManager();
        // return entityManager.remove(TaskListRightEntity, entity);
    }

    async visibleFor(account: AccountEntity): Promise<TaskListRightEntity[]> {
        throw new Error("Not yet implemented");

        // // The user gets to see all the tasklists shared to him/her.
        // return (await this.db)
        //     .createQueryBuilder(TaskListRightEntity, "right")
        //     .innerJoinAndSelect("right.account", "account")
        //     .innerJoinAndSelect("right.taskList", "taskList")
        //     .innerJoinAndSelect("taskList.owner", "owner")
        //     .where("account.id = :accountId")
        //     .orWhere("owner.id = :ownerId")
        //     .setParameters({
        //         accountId: account.id,
        //         ownerId: account.id
        //     })
        //     .getMany();
    }

    async getRightsFor(taskList: TaskListEntity): Promise<TaskListRightEntity[]> {
        throw new Error("Not yet implemented");

        // return (await this.db)
        //     .createQueryBuilder(TaskListRightEntity, "right")
        //     .innerJoinAndSelect("right.account", "account")
        //     .innerJoinAndSelect("right.taskList", "taskList")
        //     .where("taskList.id = :taskListId")
        //     .setParameters({
        //         taskListId: taskList.id,
        //     }).getMany();
    }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskListRightEntity> {
        throw new Error("Not yet implemented");

        // return (await this.db)
        //     .createQueryBuilder(TaskListRightEntity, "right")
        //     .innerJoinAndSelect("right.account", "account")
        //     .innerJoinAndSelect("right.taskList", "taskList")
        //     .innerJoinAndSelect("taskList.owner", "owner")
        //     .where(new Brackets(qb => qb
        //         .where("account.id = :accountId")
        //         .orWhere("owner.id = :ownerId")))
        //     .andWhere("right.uuid = :uuid")
        //     .setParameters({
        //         uuid: uuid,
        //         accountId: account.id,
        //         ownerId: account.id
        //     })
        //     .getOne();
    }
}
