import { injectable, inject } from "inversify";

import { AccountEntity, TaskRelationEntity, TaskRelationWithUuids } from "../db/entities";
import { Database } from "./database";
import { TaskRelation } from "../models/task-relation.model";

@injectable()
export class TaskRelationRepository {

    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskRelationWithUuids> {
        throw new Error("Not yet implemented");

        // return (await this.db())
        //     .createQueryBuilder(TaskRelationEntity, "relation")
        //     .innerJoinAndSelect("relation.sourceTask", "sourceTask")
        //     .innerJoinAndSelect("relation.targetTask", "targetTask")
        //     .innerJoin("sourceTask.taskList", "sourceTaskList")
        //     .innerJoin("sourceTaskList.rights", "sourceRight")
        //     .innerJoin("sourceRight.account", "sourceAccount")
        //     .innerJoin("targetTask.taskList", "targetTaskList")
        //     .innerJoin("targetTaskList.rights", "targetRight")
        //     .innerJoin("targetRight.account", "targetAccount")
        //     .where("relation.uuid = :uuid")
        //     .where("sourceAccount.id = :sourceAccountId")
        //     .andWhere("targetAccount.id = :targetAccountId")
        //     .setParameters({
        //         uuid: uuid,
        //         sourceAccountId: account.id,
        //         targetAccountId: account.id
        //     })
        //     .getOne();
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
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskRelationEntity, entity);
    }

    async create(entity: TaskRelationEntity): Promise<TaskRelationWithUuids> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskRelationEntity, entity);
    }

    async destroy(entity: TaskRelationEntity): Promise<TaskRelationEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(TaskRelationEntity, entity);
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
