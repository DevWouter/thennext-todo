import { injectable } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";
import { TaskListRightEntity } from "../db/entities/task-list-right.entity";

@injectable()
export class TaskListRightService {
    constructor(
        private readonly db: Connection
    ) { }

    update(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskListRightEntity, entity);
    }

    create(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskListRightEntity, entity);
    }

    destroy(entity: TaskListRightEntity): Promise<TaskListRightEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(TaskListRightEntity, entity);
    }
}
