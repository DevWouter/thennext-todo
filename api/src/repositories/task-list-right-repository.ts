import { injectable, inject } from "inversify";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListRightEntity, AccessRight } from "../db/entities/task-list-right.entity";
import { Connection } from "mysql";
import { Database, uuidv4 } from "./database";

@injectable()
export class TaskListRightRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) {
    }

    async byId(id: number): Promise<TaskListRightEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            "SELECT * FROM `TaskListRight` WHERE `id`=? LIMIT 1",
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async update(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db).createEntityManager();
        // return entityManager.save(TaskListRightEntity, entity);
    }

    async create(account: AccountEntity, tasklist: TaskListEntity, access: AccessRight): Promise<TaskListRightEntity> {
        const db = await this.database();
        const id = await db.insert<TaskListRightEntity>("TaskListRight", {
            uuid: uuidv4(),
            accountId: account.id,
            taskListId: tasklist.id,
            access: access,
        });

        return this.byId(id);

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

    private clone(src: TaskListRightEntity): TaskListRightEntity {
        return {
            access: src.access,
            accountId: src.accountId,
            id: src.id,
            taskListId: src.taskListId,
            uuid: src.uuid,
        };
    }
}
