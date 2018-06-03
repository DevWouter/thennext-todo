import { injectable } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, TaskListEntity } from "../db/entities";

@injectable()
export class TaskListService {
    constructor(
        private readonly db: Connection
    ) { }

    byUuid(uuid: string, account: AccountEntity): Promise<TaskListEntity> {
        // this function requires the account to ensure we have ownership.
        return this.db
            .createQueryBuilder(TaskListEntity, "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoin("right.account", "account")
            .where("taskList.uuid = :uuid", { uuid: uuid })
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    hasOwnership(account: AccountEntity, taskList: TaskListEntity): Promise<boolean> {
        return this.db
            .createQueryBuilder(TaskListEntity, "taskList")
            .innerJoin("taskList.owner", "owner")
            .where("taskList.id = :id", { id: taskList.id })
            .andWhere("owner.id = :id", { id: account.id })
            .getCount()
            .then(x => x === 1);
    }

    /**
     * Returns a list of tasks that are accessible (and maybe owned) by the user.
     * @param account The account that can access the lists
     */
    for(account: AccountEntity): Promise<TaskListEntity[]> {
        return this.db.createQueryBuilder(TaskListEntity, "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoinAndSelect("right.account", "account")
            .where("account.id = :id", { id: account.id })
            .getMany();
    }

    update(entity: TaskListEntity): Promise<TaskListEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskListEntity, entity);
    }

    create(entity: TaskListEntity): Promise<TaskListEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(TaskListEntity, entity);
    }

    destroy(entity: TaskListEntity): Promise<TaskListEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(TaskListEntity, entity);
    }
}
