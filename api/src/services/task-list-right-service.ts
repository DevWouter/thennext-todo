import { injectable, inject } from "inversify";
import { Connection, Brackets } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListRightEntity } from "../db/entities/task-list-right.entity";

@injectable()
export class TaskListRightService {

    private readonly db: Promise<Connection>;
    constructor(
        @inject("ConnectionProvider") dbProvider: () => Promise<Connection>
    ) {
        this.db = dbProvider();
    }

    async update(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.save(TaskListRightEntity, entity);
    }

    async create(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.save(TaskListRightEntity, entity);
    }

    async destroy(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.remove(TaskListRightEntity, entity);
    }

    async visibleFor(account: AccountEntity): Promise<TaskListRightEntity[]> {
        // The user gets to see all the tasklists shared to him/her.
        return (await this.db)
            .createQueryBuilder(TaskListRightEntity, "right")
            .innerJoinAndSelect("right.account", "account")
            .innerJoinAndSelect("right.taskList", "taskList")
            .innerJoinAndSelect("taskList.owner", "owner")
            .where("account.id = :id", { id: account.id })
            .orWhere("owner.id = :id", { id: account.id })
            .getMany();
    }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskListRightEntity> {
        return (await this.db)
            .createQueryBuilder(TaskListRightEntity, "right")
            .innerJoinAndSelect("right.account", "account")
            .innerJoinAndSelect("right.taskList", "taskList")
            .innerJoinAndSelect("taskList.owner", "owner")
            .where(new Brackets(qb => qb
                .where("account.id = :id", { id: account.id })
                .orWhere("owner.id = :id", { id: account.id })))
            .andWhere("right.uuid = :uuid", { uuid: uuid })
            .getOne();
    }
}
