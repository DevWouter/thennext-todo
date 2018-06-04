import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, ChecklistItemEntity, TaskTimeLapEntity } from "../db/entities";
import { TaskTimeLap } from "../route/task-time-lap/task-time-lap.model";

@injectable()
export class TaskTimeLapService {
    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskTimeLapEntity> {
        return (await this.db())
            .createQueryBuilder(TaskTimeLapEntity, "timelap")
            .innerJoinAndSelect("timelap.task", "task")
            .innerJoinAndSelect("timelap.owner", "owner")
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    async of(account: AccountEntity): Promise<TaskTimeLapEntity[]> {
        return (await this.db())
            .createQueryBuilder(TaskTimeLapEntity, "timelap")
            .innerJoinAndSelect("timelap.task", "task")
            .innerJoinAndSelect("timelap.owner", "owner")
            .andWhere("account.id = :id", { id: account.id })
            .getMany();
    }

    async update(entity: TaskTimeLapEntity): Promise<TaskTimeLapEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskTimeLapEntity, entity);
    }

    async create(entity: TaskTimeLapEntity): Promise<TaskTimeLapEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskTimeLapEntity, entity);
    }

    async destroy(entity: TaskTimeLapEntity): Promise<TaskTimeLapEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(TaskTimeLapEntity, entity);
    }
}
