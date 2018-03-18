import { GraphContext } from "../../helpers";
import { Task } from "../task.model";
import { TaskInput } from "./task.input";

export async function createTask(obj, args: { taskListUuid: string, input: TaskInput }, context: GraphContext, info): Promise<Task> {
    throw new Error("Not implemented");
}
