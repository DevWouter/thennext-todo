import { injectable, inject } from "inversify";
import {
    TaskEntity,
    AccountEntity,
    WithTasklistUuid
} from "../db/entities";
import { Database } from "./database";


@injectable()
export class TaskRepository {

    constructor(
        @inject("Database") private readonly database: () => Promise<Database>,
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<TaskEntity & WithTasklistUuid> {
        throw new Error("Not yet implemented");

        // return (await this.db())
        //     .createQueryBuilder(TaskEntity, "task")
        //     .leftJoinAndSelect("task.taskList", "taskList")
        //     .innerJoin("taskList.rights", "right")
        //     .innerJoin("right.account", "account")
        //     .where("task.uuid = :uuid", { uuid: uuid })
        //     .andWhere("account.id = :id", { id: account.id })
        //     .getOne();
    }

    async byId(id: number): Promise<TaskEntity & WithTasklistUuid> {
        throw new Error("Not yet implemented");

        // return (await this.db())
        //     .createQueryBuilder(TaskEntity, "task")
        //     .where("task.id = :id", { id: id })
        //     .getOne();
    }

    async of(account: AccountEntity): Promise<(TaskEntity & WithTasklistUuid)[]> {
        const db = await this.database();
        const { results } = await db.execute("SELECT" +
            " `Task`.*, `TaskList`.`uuid` as `taskListUuid`" +
            " FROM `Task`" +
            " INNER JOIN `TaskList` ON `Task`.`taskListId`=`TaskList`.`id`" +
            " INNER JOIN `TaskListRight` ON `TaskList`.`id`=`TaskListRight`.`taskListId`" +
            " WHERE `TaskListRight`.`accountId` = ?"
            , [account.id]);

        const result: (TaskEntity & WithTasklistUuid)[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            const copy = this.clone(element) as TaskEntity & WithTasklistUuid;
            copy.taskListUuid = element.taskListUuid;
            result.push(copy);
        }
        return result;

        // return (await this.db()).createQueryBuilder(TaskEntity, "task")
        //     .leftJoinAndSelect("task.taskList", "taskList")
        //     .innerJoin("taskList.rights", "right")
        //     .innerJoin("right.account", "account")
        //     .where("account.id = :id", { id: account.id })
        //     .getMany();
    }

    async update(entity: TaskEntity): Promise<TaskEntity & WithTasklistUuid> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskEntity, entity);
    }

    async create(entity: TaskEntity): Promise<TaskEntity & WithTasklistUuid> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(TaskEntity, entity);
    }

    async destroy(entity: TaskEntity): Promise<TaskEntity> {
        throw new Error("Not yet implemented");

        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(TaskEntity, entity);
    }

    private clone(src: TaskEntity): TaskEntity {
        return {
            completedAt: src.completedAt,
            createdAt: src.createdAt,
            description: src.description,
            id: src.id,
            nextChecklistOrder: src.nextChecklistOrder,
            status: src.status,
            taskListId: src.taskListId,
            title: src.title,
            updatedAt: src.updatedAt,
            uuid: src.uuid,
        };
    }
}
