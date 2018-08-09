import { injectable, inject } from "inversify";

import { AccountEntity, TaskRelationEntity, TaskRelationWithUuids } from "../db/entities";
import { Database, uuidv4 } from "./database";
import { TaskRelation } from "../models/task-relation.model";

@injectable()
export class TaskRelationRepository {

    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskRelationWithUuids> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                " `TaskRelation`.*,",
                " `SourceTask`.`uuid` AS `sourceTaskUuid`,",
                " `TargetTask`.`uuid` AS `targetTaskUuid`",
                " FROM `TaskRelation`",
                // Join for rights on source task
                " INNER JOIN `Task` AS `SourceTask` ON `TaskRelation`.`sourceTaskId`=`SourceTask`.`id`",
                " INNER JOIN `TaskList` AS `SourceTaskList` ON `SourceTask`.`taskListId`=`SourceTaskList`.`id`",
                " INNER JOIN `TaskListRight` AS `SourceTaskListRight` ON `SourceTaskList`.`id`=`SourceTaskListRight`.`taskListId`",
                // Join for rights on target task
                " INNER JOIN `Task` AS `TargetTask` ON `TaskRelation`.`targetTaskId`=`TargetTask`.`id`",
                " INNER JOIN `TaskList` AS `TargetTaskList` ON `TargetTask`.`taskListId`=`TargetTaskList`.`id`",
                " INNER JOIN `TaskListRight` AS `TargetTaskListRight` ON `TargetTaskList`.`id`=`TargetTaskListRight`.`taskListId`",
                // 
                " WHERE `TaskRelation`.`uuid` = ?",
                " AND `SourceTaskListRight`.`accountId` = ?",
                " AND `TargetTaskListRight`.`accountId` = ?",
                " LIMIT 1"
            ]
            , [uuid, account.id, account.id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async byId(id: number): Promise<TaskRelationWithUuids> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT",
                " `TaskRelation`.*,",
                " `SourceTask`.`uuid` AS `sourceTaskUuid`,",
                " `TargetTask`.`uuid` AS `targetTaskUuid`",
                "FROM `TaskRelation`",
                "INNER JOIN `Task` AS `SourceTask` ON `TaskRelation`.`sourceTaskId`=`SourceTask`.`id`",
                "INNER JOIN `Task` AS `TargetTask` ON `TaskRelation`.`targetTaskId`=`TargetTask`.`id`",
                "WHERE `TaskRelation`.`id` = ?",
                "LIMIT 1"
            ]
            , [id]
        );


        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async of(account: AccountEntity): Promise<TaskRelationWithUuids[]> {
        const db = await this.database();
        const { results } = await db.execute([
            "SELECT",
            " `TaskRelation`.*,",
            " `SourceTask`.`uuid` AS `sourceTaskUuid`, ",
            " `TargetTask`.`uuid` AS `targetTaskUuid`",
            "FROM `TaskRelation`",
            // Join for rights on source task
            "INNER JOIN `Task` AS `SourceTask` ON `TaskRelation`.`sourceTaskId`=`SourceTask`.`id`",
            "INNER JOIN `TaskList` AS `SourceTaskList` ON `SourceTask`.`taskListId`=`SourceTaskList`.`id`",
            "INNER JOIN `TaskListRight` AS `SourceTaskListRight` ON `SourceTaskList`.`id`=`SourceTaskListRight`.`taskListId`",
            // Join for rights on target task
            "INNER JOIN `Task` AS `TargetTask` ON `TaskRelation`.`targetTaskId`=`TargetTask`.`id`",
            "INNER JOIN `TaskList` AS `TargetTaskList` ON `TargetTask`.`taskListId`=`TargetTaskList`.`id`",
            "INNER JOIN `TaskListRight` AS `TargetTaskListRight` ON `TargetTaskList`.`id`=`TargetTaskListRight`.`taskListId`",
            // Check if the account has access to both target and source tasklist
            "WHERE 1=1 ",
            "AND `SourceTaskListRight`.`accountId` = ?",
            "AND `TargetTaskListRight`.`accountId` = ?"
        ], [account.id, account.id]);

        const result: TaskRelationWithUuids[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            const copy = this.clone(element);
            result.push(copy);
        }

        return result;
    }

    async update(entity: TaskRelationEntity): Promise<TaskRelationWithUuids> {
        const db = await this.database();
        await db.update<TaskRelationEntity>("TaskRelation", {
            relationType: entity.relationType,
            sourceTaskId: entity.sourceTaskId,
            targetTaskId: entity.targetTaskId,
        }, { id: entity.id }, 1);

        return this.byId(entity.id);
    }

    async create(entity: TaskRelationEntity): Promise<TaskRelationWithUuids> {
        const db = await this.database();
        const id = await db.insert<TaskRelationEntity>("TaskRelation", {
            uuid: uuidv4(),
            relationType: entity.relationType,
            sourceTaskId: entity.sourceTaskId,
            targetTaskId: entity.targetTaskId,
        });

        return this.byId(id);
    }

    async destroy(entity: TaskRelationEntity): Promise<void> {
        const db = await this.database();
        await db.delete<TaskRelationEntity>("TaskRelation", {
            id: entity.id,
        }, 1);
    }

    clone(src: TaskRelationWithUuids): TaskRelationWithUuids {
        return {
            id: src.id,
            relationType: src.relationType,
            sourceTaskId: src.sourceTaskId,
            sourceTaskUuid: src.sourceTaskUuid,
            targetTaskId: src.targetTaskId,
            targetTaskUuid: src.targetTaskUuid,
            uuid: src.uuid,
        };
    }
}
