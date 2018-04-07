import { TaskList } from "../task-list.model";
import { TaskListInput } from "./task-list.input";
import { GraphContext } from "../../helpers";
import { TaskListEntity } from "../../../db/entities";

export async function createTaskList(obj, args: { name: string }, context: GraphContext, info): Promise<TaskList> {
    const taskList = context.entityManager.create(TaskListEntity);
    taskList.name = args.name;
    taskList.owner = await context.getAccount();

    const savePromise = context.entityManager.save(taskList).then(x => {
        // Reload the entity so that we have all the needed values.
        return context.entityManager.preload(TaskListEntity, x);
    });

    savePromise.catch(x => console.error(x));

    return savePromise.then(x =>
        <TaskList>{
            _id: x.id,
            name: x.name,
            uuid: x.uuid,
            primary: x.primary,
        }
    );
}
