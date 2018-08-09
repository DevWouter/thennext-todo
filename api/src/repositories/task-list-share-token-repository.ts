import { injectable, inject } from "inversify";
import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListShareTokenEntity } from "../db/entities/task-list-share-token.entity";
import { Database, uuidv4 } from "./database";


@injectable()
export class TaskListShareTokenRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) {
        // this.db = dbPromise();
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

    async update(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db).createEntityManager();
        // return entityManager.save(TaskListShareTokenEntity, entity);
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
     * Looks up and detects if a token for a task list exists.
     * @param token The share token
     * @param taskListUuid The tasklist for which it was intended.
     */
    async byTokenAndListUuid(token: string, taskListUuid: string): Promise<TaskListShareTokenEntity> {
        throw new Error("Not yet implemented");

        // return (await this.db)
        //     .createQueryBuilder(TaskListShareTokenEntity, "taskListShareToken")
        //     .leftJoinAndSelect("taskListShareToken.taskList", "taskList")
        //     .where("taskListShareToken.token = :token", { token: token })
        //     .andWhere("taskList.uuid = :taskListUuid", { taskListUuid: taskListUuid })
        //     .getOne();
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
