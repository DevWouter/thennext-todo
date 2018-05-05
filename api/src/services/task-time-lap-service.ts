import { injectable } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, ChecklistItemEntity, TaskTimeLapEntity } from "../db/entities";
import { TaskTimeLap } from "../route/task-time-lap/task-time-lap.model";

@injectable()
export class TaskTimeLapService {
    constructor(
        private readonly db: Connection
    ) { }

    byUuid(uuid: string, account: AccountEntity): Promise<TaskTimeLapEntity> {
        // this function requires the account to ensure we have ownership.
        return this.db
            .createQueryBuilder(TaskTimeLapEntity, "timelap")
            .innerJoinAndSelect("timelap.task", "task")
            .innerJoinAndSelect("timelap.owner", "owner")
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    of(account: AccountEntity): Promise<TaskTimeLapEntity[]> {
        return this.db
            .createQueryBuilder(TaskTimeLapEntity, "timelap")
            .innerJoinAndSelect("timelap.task", "task")
            .innerJoinAndSelect("timelap.owner", "owner")
            .andWhere("account.id = :id", { id: account.id })
            .getMany();
    }

    update(entity: TaskTimeLapEntity): Promise<TaskTimeLapEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskTimeLapEntity, entity);
    }

    create(entity: TaskTimeLapEntity): Promise<TaskTimeLapEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskTimeLapEntity, entity);
    }

    destroy(entity: TaskTimeLapEntity): Promise<TaskTimeLapEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(TaskTimeLapEntity, entity);
    }
}
