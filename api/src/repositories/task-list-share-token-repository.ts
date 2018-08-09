import { injectable, inject } from "inversify";
import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListShareTokenEntity } from "../db/entities/task-list-share-token.entity";
import { Database, uuidv4 } from "./database";


@injectable()
export class TaskListShareTokenRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) {
    }

    async byId(id: number): Promise<TaskListShareTokenEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                "  `TaskListShareToken`.*",
                "FROM `TaskListShareToken`",
                "WHERE `TaskListShareToken`.`id`=?",
            ],
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async create(tasklist: TaskListEntity, token: string): Promise<TaskListShareTokenEntity> {
        const db = await this.database();
        const id = await db.insert<TaskListShareTokenEntity>("TaskListShareToken", {
            uuid: uuidv4(),
            taskListId: tasklist.id,
            token: token
        });

        return this.byId(id);
    }

    async destroy(entity: TaskListShareTokenEntity): Promise<void> {
        const db = await this.database();
        await db.delete<TaskListShareTokenEntity>("TaskListShareToken", { id: entity.id }, 1);
    }

    /**
     * Returns a list of tokens available for a specefic account.
     * @param account The account that should own the tokens
     */
    async of(account: AccountEntity): Promise<TaskListShareTokenEntity[]> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                "  `TaskListShareToken`.*",
                "FROM `TaskListShareToken`",
                "INNER JOIN `TaskList` ON `TaskListShareToken`.`taskListId`=`TaskList`.`id`",
                "WHERE 1=1",
                "  AND `TaskList`.`ownerId`=?"
            ],
            [account.id]
        );

        const result: TaskListShareTokenEntity[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            result.push(this.clone(element));
        }

        return result;
    }

    /**
     * Looks up a share token owned by the account
     * @param uuid The unique id of the token
     * @param account The account that should own the tokens
     */
    async byUuid(uuid: string, account: AccountEntity): Promise<TaskListShareTokenEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                "  `TaskListShareToken`.*",
                "FROM `TaskListShareToken`",
                "INNER JOIN `TaskList` ON `TaskListShareToken`.`taskListId`=`TaskList`.`id`",
                "WHERE 1=1",
                "  AND `TaskListShareToken`.`uuid`=?",
                "  AND `TaskList`.`ownerId`=?",
            ],
            [uuid, account.id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    private clone(src: TaskListShareTokenEntity): TaskListShareTokenEntity {
        return {
            id: src.id,
            taskListId: src.taskListId,
            token: src.token,
            uuid: src.uuid,
        };
    }
}
