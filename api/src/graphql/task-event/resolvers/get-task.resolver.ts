import { GraphContext } from "../../helpers";
import { Task } from "../../task/task.model";
import { TaskEvent } from "../task-event.model";

export async function getTask(obj: TaskEvent, args: {}, context: GraphContext, info): Promise<Task> {
    throw new Error("not implemented");
}