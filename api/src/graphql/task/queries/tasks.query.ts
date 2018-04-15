import { GraphContext } from "../../helpers";
import { Task } from "../task.model";
import { TaskEntity } from "../../../db/entities";

export async function tasks(obj, args: {}, context: GraphContext, info): Promise<Task[]> {
    const query = context.db
        .createQueryBuilder(TaskEntity, "task")
        .innerJoinAndSelect("task.taskList", "taskList")
        .innerJoinAndSelect("taskList.owner", "account")
        .innerJoin("account.sessions", "session", "session.token = :token", { token: context.authorizationToken })
        ;

    const result = query.getMany().then(items => items.map(x => <Task>{
        _id: x.id,
        uuid: x.uuid,
        taskListUuid: x.taskList.uuid,
        title: x.title,
        status: x.status,
    }));

    return result;
}
