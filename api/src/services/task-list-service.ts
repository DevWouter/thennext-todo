import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";

@injectable()
export class TaskListService {
    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskListEntity> {
        return (await this.db())
            .createQueryBuilder(TaskListEntity, "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoin("right.account", "account")
            .where("taskList.uuid = :uuid")
            .andWhere("account.id = :accountId")
            .setParameters({
                uuid: uuid,
                accountId: account.id
            })
            .getOne();
    }

    async hasOwnership(account: AccountEntity, taskList: TaskListEntity): Promise<boolean> {
        return (await this.db())
            .createQueryBuilder(TaskListEntity, "taskList")
            .innerJoin("taskList.owner", "owner")
            .where("taskList.id = :taskListId")
            .andWhere("owner.id = :accountId")
            .setParameters({
                taskListId: taskList.id,
                accountId: account.id
            })
            .getCount()
            .then(x => x === 1);
    }

    /**
     * Returns a list of tasks that are accessible (and maybe owned) by the user.
     * @param account The account that can access the lists
     */
    async for(account: AccountEntity): Promise<TaskListEntity[]> {
        return (await this.db()).createQueryBuilder(TaskListEntity, "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoinAndSelect("taskList.owner", "owner")
            .innerJoinAndSelect("right.account", "account")
            .where("account.id = :accountId")
            .setParameters({
                accountId: account.id
            })
            .getMany();
    }

    async update(entity: TaskListEntity): Promise<TaskListEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskListEntity, entity);
    }

    async create(entity: TaskListEntity): Promise<TaskListEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(TaskListEntity, entity);
    }

    async destroy(entity: TaskListEntity): Promise<TaskListEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(TaskListEntity, entity);
    }
}
