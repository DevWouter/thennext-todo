import { injectable, inject } from "inversify";
import { TaskEntity, AccountEntity, TaskListEntity } from "../db/entities";
import { Connection } from "typeorm";

@injectable()
export class TaskService {

    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskEntity> {
        return (await this.db())
            .createQueryBuilder(TaskEntity, "task")
            .leftJoinAndSelect("task.taskList", "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoin("right.account", "account")
            .where("task.uuid = :uuid", { uuid: uuid })
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    async byId(id: number): Promise<TaskEntity> {
        return (await this.db())
            .createQueryBuilder(TaskEntity, "task")
            .where("task.id = :id", { id: id })
            .getOne();
    }

    async of(account: AccountEntity): Promise<TaskEntity[]> {
        return (await this.db()).createQueryBuilder(TaskEntity, "task")
            .leftJoinAndSelect("task.taskList", "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoin("right.account", "account")
            .where("account.id = :id", { id: account.id })
            .getMany();
    }

    async update(entity: TaskEntity): Promise<TaskEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskEntity, entity);
    }

    async create(entity: TaskEntity): Promise<TaskEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskEntity, entity);
    }

    async destroy(entity: TaskEntity): Promise<TaskEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(TaskEntity, entity);
    }
}
