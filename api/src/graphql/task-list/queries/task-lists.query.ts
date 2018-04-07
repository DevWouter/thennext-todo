import { GraphContext } from "../../helpers";
import { TaskList } from "../task-list.model";
import { TaskListEntity } from "../../../db/entities";

export async function taskLists(obj, args: {}, context: GraphContext, info): Promise<TaskList[]> {
    const query = context.db
        .createQueryBuilder(TaskListEntity, "taskList")
        .innerJoinAndSelect("taskList.owner", "account")
        .innerJoin("account.sessions", "session", "session.token = :token", { token: context.authorizationToken })
        ;

    const result = query.getMany().then(items => items.map(x => <TaskList>{
        _id: x.id,
        name: x.name,
        primary: x.primary,
        uuid: x.uuid,
    }));

    return result;
}
