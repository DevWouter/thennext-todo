import { injectable } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListShareTokenEntity } from "../db/entities/task-list-share-token.entity";


@injectable()
export class TaskListShareTokenService {
    constructor(
        private readonly db: Connection
    ) { }

    create(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskListShareTokenEntity, entity);
    }

    update(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskListShareTokenEntity, entity);
    }

    destroy(entity: TaskListShareTokenEntity): Promise<TaskListShareTokenEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(TaskListShareTokenEntity, entity);
    }
}
