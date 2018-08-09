import { injectable, inject } from "inversify";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { Database, uuidv4 } from "./database";

@injectable()
export class TaskListRepository {

    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskListEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `TaskList`.* FROM `TaskList`",
                "INNER JOIN `TaskListRight` ON `TaskListRight`.`taskListId`=`TaskList`.`id`",
                "WHERE `TaskListRight`.`accountId` = ?",
                "  AND `TaskList`.`uuid` = ?",
                "LIMIT 1"
            ], [account.id, uuid]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async hasOwnership(account: AccountEntity, taskList: TaskListEntity): Promise<boolean> {
        throw new Error("Not yet implemented");

        // return (await this.db())
        //     .createQueryBuilder(TaskListEntity, "taskList")
        //     .innerJoin("taskList.owner", "owner")
        //     .where("taskList.id = :taskListId")
        //     .andWhere("owner.id = :accountId")
        //     .setParameters({
        //         taskListId: taskList.id,
        //         accountId: account.id
        //     })
        //     .getCount()
        //     .then(x => x === 1);
    }

    /**
     * Returns a list of tasks that are accessible (and maybe owned) by the user.
     * @param account The account that can access the lists
     */
    async for(account: AccountEntity): Promise<TaskListEntity[]> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `TaskList`.* FROM `TaskList`",
                "INNER JOIN `TaskListRight` ON `TaskListRight`.`taskListId`=`TaskList`.`id`",
                "WHERE `TaskListRight`.`accountId` = ?"
            ], [account.id]
        );

        const result: TaskListEntity[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            result.push(this.clone(element));
        }
        return result;

        // return (await this.db()).createQueryBuilder(TaskListEntity, "taskList")
        //     .innerJoin("taskList.rights", "right")
        //     .innerJoinAndSelect("taskList.owner", "owner")
        //     .innerJoinAndSelect("right.account", "account")
        //     .where("account.id = :accountId")
        //     .setParameters({
        //         accountId: account.id
        //     })
        //     .getMany();
    }

    async byId(id: number): Promise<TaskListEntity | null> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `TaskList`.* FROM `TaskList`",
                "WHERE `TaskList`.`id` = ?",
                "LIMIT 1"
            ],
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async update(entity: TaskListEntity): Promise<TaskListEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskListEntity, entity);
    }

    async create(name: string, account: AccountEntity): Promise<TaskListEntity> {
        const db = await this.database();
        const id = await db.insert<TaskListEntity>("TaskList",
            {
                uuid: uuidv4(),
                name: name,
                ownerId: account.id
            }
        );

        return this.byId(id);
    }

    async destroy(entity: TaskListEntity): Promise<void> {
        const db = await this.database();
        await db.delete<TaskListEntity>("TaskList", { id: entity.id }, 1);
    }

    private clone(src: TaskListEntity): TaskListEntity {
        return {
            id: src.id,
            name: src.name,
            ownerId: src.ownerId,
            uuid: src.uuid,
        };
    }
}
