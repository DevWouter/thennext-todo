import { injectable, inject } from "inversify";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListRightEntity, AccessRight } from "../db/entities/task-list-right.entity";
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
            "SELECT `TaskListRight`.* FROM `TaskListRight` WHERE `TaskListRight`.`id`=? LIMIT 1",
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
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
    }

    async destroy(entity: TaskListRightEntity): Promise<void> {
        const db = await this.database();
        await db.delete<TaskListRightEntity>("TaskListRight", { id: entity.id }, 1);
    }

    async visibleFor(account: AccountEntity): Promise<TaskListRightEntity[]> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                "  `TaskListRight`.*",
                "FROM `TaskListRight`",
                "WHERE 1=1",
                "  AND `TaskListRight`.`accountId`=?"
            ],
            [account.id]
        );

        const result: TaskListRightEntity[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            result.push(this.clone(element));
        }

        return result;
    }

    async getRightsFor(taskList: TaskListEntity): Promise<TaskListRightEntity[]> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                "  `TaskListRight`.*",
                "FROM `TaskListRight`",
                "WHERE 1=1",
                "  AND `TaskListRight`.`taskListId`=?"
            ],
            [taskList.id]
        );

        const result: TaskListRightEntity[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            result.push(this.clone(element));
        }

        return result;
    }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskListRightEntity> {
        // The account should either be the owner of the list 
        // or 
        // The the one that is affected by the right.
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `TaskListRight`.* FROM `TaskListRight`",
                "INNER JOIN `TaskList` ON `TaskListRight`.`taskListId`=`TaskList`.`id`",
                "WHERE `TaskListRight`.`uuid`=?",
                "  AND (",
                "    `TaskListRight`.`accountId`=? OR `TaskList`.`ownerId`=?",
                "  )",
                "LIMIT 1"
            ],
            [uuid, account.id, account.id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
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
