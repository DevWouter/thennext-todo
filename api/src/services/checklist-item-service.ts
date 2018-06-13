import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, ChecklistItemEntity } from "../db/entities";

@injectable()
export class ChecklistItemService {
    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<ChecklistItemEntity> {
        return (await this.db())
            .createQueryBuilder(ChecklistItemEntity, "checklistItem")
            .innerJoinAndSelect("checklistItem.task", "task")
            .innerJoin("task.taskList", "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoin("right.account", "account")
            .where("checklistItem.uuid = :uuid", { uuid: uuid })
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    async byId(id: number): Promise<ChecklistItemEntity> {
        return (await this.db())
            .createQueryBuilder(ChecklistItemEntity, "checklistItem")
            .where("checklistItem.id = :id", { id: id })
            .getOne();
    }

    async of(account: AccountEntity): Promise<ChecklistItemEntity[]> {
        return (await this.db())
            .createQueryBuilder(ChecklistItemEntity, "checklistItem")
            .leftJoinAndSelect("checklistItem.task", "task")
            .innerJoin("task.taskList", "taskList")
            .innerJoin("taskList.rights", "right")
            .innerJoin("right.account", "account")
            .andWhere("account.id = :id", { id: account.id })
            .getMany();
    }

    async update(entity: ChecklistItemEntity): Promise<ChecklistItemEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(ChecklistItemEntity, entity);
    }

    async create(entity: ChecklistItemEntity): Promise<ChecklistItemEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(ChecklistItemEntity, entity);
    }

    async destroy(entity: ChecklistItemEntity): Promise<ChecklistItemEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(ChecklistItemEntity, entity);
    }
}
