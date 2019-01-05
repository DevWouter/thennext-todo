import { injectable, inject } from "inversify";
import {
    TaskEntity,
    AccountEntity,
    WithTasklistUuid
} from "../db/entities";
import { Database, uuidv4 } from "./database";


@injectable()
export class TaskRepository {

    constructor(
        @inject("Database") private readonly database: () => Promise<Database>,
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskEntity & WithTasklistUuid> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                " `Task`.*, `TaskList`.`uuid` as `taskListUuid`",
                "FROM `Task`",
                "INNER JOIN `TaskList` ON `Task`.`taskListId`=`TaskList`.`id`",
                "WHERE `TaskList`.`ownerId` = ? AND `Task`.`uuid` = ?"
            ]
            ,
            [account.id, uuid]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async byId(id: number): Promise<TaskEntity & WithTasklistUuid> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                " `Task`.*, `TaskList`.`uuid` as `taskListUuid`",
                "FROM `Task`",
                "INNER JOIN `TaskList` ON `Task`.`taskListId`=`TaskList`.`id`",
                "WHERE `Task`.`id` = ?"
            ]
            ,
            [id]
        );
        if (results.length === 0) {
            return null;
        }
        return this.clone(results[0]);
    }

    async of(account: AccountEntity): Promise<(TaskEntity & WithTasklistUuid)[]> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                " `Task`.*, `TaskList`.`uuid` as `taskListUuid`",
                "FROM `Task`",
                "INNER JOIN `TaskList` ON `Task`.`taskListId`=`TaskList`.`id`",
                "WHERE `TaskList`.`ownerId` = ?"
            ]
            ,
            [account.id]);

        const result: (TaskEntity & WithTasklistUuid)[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            const copy = this.clone(element);
            result.push(copy);
        }
        return result;
    }

    async update(entity: TaskEntity): Promise<TaskEntity & WithTasklistUuid> {
        const db = await this.database();
        await db.update<TaskEntity>("Task", {
            title: entity.title,
            description: entity.description,
            nextChecklistOrder: entity.nextChecklistOrder,
            status: entity.status,
            taskListId: entity.taskListId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            completedAt: entity.completedAt,
            estimatedDuration: entity.estimatedDuration,
        }, { id: entity.id }, 1);

        return this.byId(entity.id);
    }

    async create(entity: TaskEntity): Promise<TaskEntity & WithTasklistUuid> {
        const db = await this.database();
        const id = await db.insert<TaskEntity>("Task", {
            id: undefined,
            uuid: uuidv4(),
            description: entity.description,
            nextChecklistOrder: entity.nextChecklistOrder,
            status: entity.status,
            taskListId: entity.taskListId,
            title: entity.title,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            completedAt: undefined,
            estimatedDuration: entity.estimatedDuration,
        })

        return this.byId(id);
    }

    async destroy(entity: TaskEntity): Promise<void> {
        const db = await this.database();
        await db.delete<TaskEntity>("Task", { id: entity.id }, 1);
    }

    private clone(src: TaskEntity & WithTasklistUuid): TaskEntity & WithTasklistUuid {
        return {
            completedAt: src.completedAt,
            createdAt: src.createdAt,
            description: src.description,
            id: src.id,
            nextChecklistOrder: src.nextChecklistOrder,
            status: src.status,
            taskListId: src.taskListId,
            title: src.title,
            estimatedDuration: src.estimatedDuration,
            updatedAt: src.updatedAt,
            uuid: src.uuid,
            taskListUuid: src.taskListUuid,
        };
    }
}
