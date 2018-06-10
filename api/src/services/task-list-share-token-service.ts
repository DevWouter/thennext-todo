import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListShareTokenEntity } from "../db/entities/task-list-share-token.entity";


@injectable()
export class TaskListShareTokenService {
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
