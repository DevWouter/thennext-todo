import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListShareTokenEntity } from "../db/entities/task-list-share-token.entity";


@injectable()
export class TaskListShareTokenService {
    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async create(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskListShareTokenEntity, entity);
    }

    async update(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskListShareTokenEntity, entity);
    }

    async destroy(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(TaskListShareTokenEntity, entity);
    }
}
