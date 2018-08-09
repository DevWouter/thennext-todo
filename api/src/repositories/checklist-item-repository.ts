import { injectable, inject } from "inversify";

import { AccountEntity, ChecklistItemEntity, WithTaskUuid } from "../db/entities";
import { Database, uuidv4 } from "./database";

@injectable()
export class ChecklistItemRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<ChecklistItemEntity & WithTaskUuid> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                " SELECT ",
                "   `ChecklistItem`.*,",
                "   `Task`.`uuid` AS `taskUuid`",
                " FROM `ChecklistItem`",
                " INNER JOIN `Task` ON `Task`.`id`=`ChecklistItem`.`taskId`",
                " INNER JOIN `TaskListRight` ON `TaskListRight`.`taskListId`=`Task`.`taskListId`",
                " WHERE `ChecklistItem`.`uuid` = ? ",
                "   AND `TaskListRight`.`accountId` = ?",
                " LIMIT 1"
            ],
            [uuid, account.id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async byId(id: number): Promise<ChecklistItemEntity & WithTaskUuid> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                " SELECT ",
                "   `ChecklistItem`.*,",
                "   `Task`.`uuid` AS `taskUuid`",
                " FROM `ChecklistItem`",
                " INNER JOIN `Task` ON `Task`.`id`=`ChecklistItem`.`taskId`",
                " WHERE `ChecklistItem`.`id` = ? ",
                " LIMIT 1"
            ],
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
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
    }

    async update(entity: ChecklistItemEntity): Promise<ChecklistItemEntity & WithTaskUuid> {
        const db = await this.database();
        await db.update<ChecklistItemEntity>("ChecklistItem", {
            title: entity.title,
            checked: entity.checked,
            order: entity.order,
            taskId: entity.taskId,
        }, { id: entity.id }, 1);

        return this.byId(entity.id);
    }

    async create(entity: ChecklistItemEntity): Promise<ChecklistItemEntity & WithTaskUuid> {
        const db = await this.database();
        const id = await db.insert<ChecklistItemEntity>("ChecklistItem", {
            uuid: uuidv4(),
            title: entity.title,
            checked: entity.checked,
            order: entity.order,
            taskId: entity.taskId,
        });

        return this.byId(id);
    }

    async destroy(entity: ChecklistItemEntity): Promise<void> {
        const db = await this.database();
        await db.delete<ChecklistItemEntity>("ChecklistItem", { id: entity.id }, 1);
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
