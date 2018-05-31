import { injectable } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, ChecklistItemEntity } from "../db/entities";

@injectable()
export class ChecklistItemService {
    constructor(
        private readonly db: Connection
    ) { }

    byUuid(uuid: string, account: AccountEntity): Promise<ChecklistItemEntity> {
        // this function requires the account to ensure we have ownership.
        return this.db
            .createQueryBuilder(ChecklistItemEntity, "checklistItem")
            .innerJoinAndSelect("checklistItem.task", "task")
            .innerJoin("task.taskList", "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoin("right.account", "account")
            .where("checklistItem.uuid = :uuid", { uuid: uuid })
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    byId(id: number): Promise<ChecklistItemEntity> {
        return this.db
            .createQueryBuilder(ChecklistItemEntity, "checklistItem")
            .where("checklistItem.id = :id", { id: id })
            .getOne();
    }

    of(account: AccountEntity): Promise<ChecklistItemEntity[]> {
        return this.db
            .createQueryBuilder(ChecklistItemEntity, "checklistItem")
            .leftJoinAndSelect("checklistItem.task", "task")
            .innerJoin("task.taskList", "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoin("right.account", "account")
            .andWhere("account.id = :id", { id: account.id })
            .getMany();
    }

    update(entity: ChecklistItemEntity): Promise<ChecklistItemEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(ChecklistItemEntity, entity);
    }

    create(entity: ChecklistItemEntity): Promise<ChecklistItemEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(ChecklistItemEntity, entity);
    }

    destroy(entity: ChecklistItemEntity): Promise<ChecklistItemEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(ChecklistItemEntity, entity);
    }
}
