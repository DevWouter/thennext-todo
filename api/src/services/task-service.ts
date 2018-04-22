import { injectable } from "inversify";
import { Request } from "express";
import { TaskEntity, AccountEntity, TaskListEntity } from "../db/entities";
import { Connection } from "typeorm";

@injectable()
export class TaskService {

    constructor(
        private readonly db: Connection
    ) { }

    byUuid(uuid: string, account: AccountEntity): Promise<TaskEntity> {
        // this function requires the account to ensure we have ownership.
        return this.db
            .createQueryBuilder(TaskEntity, "task")
            .leftJoinAndSelect("task.taskList", "taskList")
            .innerJoin("taskList.owner", "account")
            .where("task.uuid = :uuid", { uuid: uuid })
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    byId(id: number): Promise<TaskEntity> {
        return this.db
            .createQueryBuilder(TaskEntity, "task")
            .where("task.id = :id", { id: id })
            .getOne();
    }

    of(account: AccountEntity): Promise<TaskEntity[]> {
        return this.db.createQueryBuilder(TaskEntity, "task")
            .leftJoinAndSelect("task.taskList", "taskList")
            .innerJoin("taskList.owner", "account")
            .where("account.id = :id", { id: account.id })
            .getMany();
    }

    update(entity: TaskEntity): Promise<TaskEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskEntity, entity);
    }

    create(entity: TaskEntity): Promise<TaskEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskEntity, entity);
    }

    destroy(entity: TaskEntity): Promise<void> {
        const entityManager = this.db.createEntityManager();
        return entityManager.delete(TaskEntity, entity);
    }
}
