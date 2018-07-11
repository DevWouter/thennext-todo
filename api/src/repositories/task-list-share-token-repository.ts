import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListShareTokenEntity } from "../db/entities/task-list-share-token.entity";


@injectable()
export class TaskListShareTokenRepository {
    private readonly db: Promise<Connection>;
    constructor(
        @inject("ConnectionProvider") dbPromise: () => Promise<Connection>
    ) {
        this.db = dbPromise();
    }

    async create(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.save(TaskListShareTokenEntity, entity);
    }

    async update(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.save(TaskListShareTokenEntity, entity);
    }

    async destroy(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.remove(TaskListShareTokenEntity, entity);
    }

    /**
     * Returns a list of tokens available for a specefic account.
     * @param account The account that should own the tokens
     */
    async of(account: AccountEntity): Promise<TaskListShareTokenEntity[]> {
        return (await this.db)
            .createQueryBuilder(TaskListShareTokenEntity, "taskListShareToken")
            .leftJoinAndSelect("taskListShareToken.taskList", "taskList")
            .innerJoin("taskList.owner", "account")
            .where("account.id = :id", { id: account.id })
            .getMany();
    }

    /**
     * Looks up and detects if a token for a task list exists.
     * @param token The share token
     * @param taskListUuid The tasklist for which it was intended.
     */
    async byTokenAndListUuid(token: string, taskListUuid: string): Promise<TaskListShareTokenEntity> {
        return (await this.db)
            .createQueryBuilder(TaskListShareTokenEntity, "taskListShareToken")
            .leftJoinAndSelect("taskListShareToken.taskList", "taskList")
            .where("taskListShareToken.token = :token", { token: token })
            .andWhere("taskList.uuid = :taskListUuid", { taskListUuid: taskListUuid })
            .getOne();
    }

    /**
     * Looks up a share token owned by the account
     * @param uuid The unique id of the token
     * @param account The account that should own the tokens
     */
    async byUuid(uuid: string, account: AccountEntity): Promise<TaskListShareTokenEntity> {
        return (await this.db)
            .createQueryBuilder(TaskListShareTokenEntity, "taskListShareToken")
            .leftJoinAndSelect("taskListShareToken.taskList", "taskList")
            .innerJoin("taskList.owner", "account")
            .where("account.id = :id", { id: account.id })
            .where("taskListShareToken.uuid = :uuid", { uuid: uuid })
            .getOne();
    }
}
