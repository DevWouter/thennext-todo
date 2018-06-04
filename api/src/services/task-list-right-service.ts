import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListRightEntity } from "../db/entities/task-list-right.entity";

@injectable()
export class TaskListRightService {
    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async update(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskListRightEntity, entity);
    }

    async create(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskListRightEntity, entity);
    }

    async destroy(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(TaskListRightEntity, entity);
    }
}
