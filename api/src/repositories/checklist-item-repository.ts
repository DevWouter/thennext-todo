import { injectable, inject } from "inversify";

import { AccountEntity, ChecklistItemEntity, WithTaskUuid } from "../db/entities";
import { Database } from "./database";

@injectable()
export class ChecklistItemRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string): Promise<ChecklistItemEntity & WithTaskUuid> {
        throw new Error("Not yet implemented");
        // return (await this.db())
        //     .createQueryBuilder(ChecklistItemEntity, "checklistItem")
        //     .innerJoinAndSelect("checklistItem.task", "task")
        //     .innerJoin("task.taskList", "taskList")
        //     .innerJoin("taskList.rights", "right")
        //     .innerJoin("right.account", "account")
        //     .where("checklistItem.uuid = :uuid", { uuid: uuid })
        //     .andWhere("account.id = :id", { id: account.id })
        //     .getOne();
    }

    async byId(id: number): Promise<ChecklistItemEntity & WithTaskUuid> {
        throw new Error("Not yet implemented");
        // return (await this.db())
        //     .createQueryBuilder(ChecklistItemEntity, "checklistItem")
        //     .where("checklistItem.id = :id", { id: id })
        //     .getOne();
    }

    async of(account: AccountEntity): Promise<(ChecklistItemEntity & WithTaskUuid)[]> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                " SELECT ",
                "   `ChecklistItem`.*,",
                "   `Task`.`uuid` AS `taskUuid`",
                " FROM `ChecklistItem`",
                " INNER JOIN `Task` ON `Task`.`id`=`ChecklistItem`.`taskId`",
                " INNER JOIN `TaskListRight` ON `TaskListRight`.`taskListId`=`Task`.`taskListId`",
                " WHERE `TaskListRight`.`accountId` = ?"
            ],
            [account.id]
        );

        const result: (ChecklistItemEntity & WithTaskUuid)[] = [];
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            const copy = this.clone(element);
            result.push(copy);
        }

        return result;
        // return (await this.db())
        //     .createQueryBuilder(ChecklistItemEntity, "checklistItem")
        //     .leftJoinAndSelect("checklistItem.task", "task")
        //     .innerJoin("task.taskList", "taskList")
        //     .innerJoin("taskList.rights", "right")
        //     .innerJoin("right.account", "account")
        //     .andWhere("account.id = :id", { id: account.id })
        //     .getMany();
    }

    async update(entity: ChecklistItemEntity): Promise<ChecklistItemEntity & WithTaskUuid> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(ChecklistItemEntity, entity);
    }

    async create(entity: ChecklistItemEntity): Promise<ChecklistItemEntity & WithTaskUuid> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(ChecklistItemEntity, entity);
    }

    async destroy(entity: ChecklistItemEntity): Promise<ChecklistItemEntity & WithTaskUuid> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(ChecklistItemEntity, entity);
    }

    private clone(src: ChecklistItemEntity & WithTaskUuid): ChecklistItemEntity & WithTaskUuid {
        return {
            checked: src.checked,
            id: src.id,
            taskId: src.taskId,
            uuid: src.uuid,
            title: src.title,
            order: src.order,
            taskUuid: src.taskUuid,
        };
    }
}
