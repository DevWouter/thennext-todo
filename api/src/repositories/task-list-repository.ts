import { injectable, inject } from "inversify";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { Database } from "./database";

@injectable()
export class TaskListRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskListEntity> {
        throw new Error("Not yet implemented");
        // return (await this.db())
        //     .createQueryBuilder(TaskListEntity, "taskList")
        //     .innerJoinAndSelect("taskList.owner", "owner")
        //     .innerJoin("taskList.rights", "right")
        //     .innerJoin("right.account", "account")
        //     .where("taskList.uuid = :uuid")
        //     .andWhere("account.id = :accountId")
        //     .setParameters({
        //         uuid: uuid,
        //         accountId: account.id
        //     })
        //     .getOne();
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
        const { results } = await db.execute("SELECT `TaskList`.* FROM `TaskList`" +
            " INNER JOIN `TaskListRight` ON `TaskListRight`.`taskListId`=`TaskList`.`id`" +
            " WHERE `TaskListRight`.`accountId` = ?"
            , [account.id]);

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

    async update(entity: TaskListEntity): Promise<TaskListEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskListEntity, entity);
    }

    async create(entity: TaskListEntity): Promise<TaskListEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskListEntity, entity);
    }

    async destroy(entity: TaskListEntity): Promise<TaskListEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(TaskListEntity, entity);
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
