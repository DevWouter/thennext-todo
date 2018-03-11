import { GraphContext } from "../../helpers";
import { Task } from "../task.model";
import { TaskInput } from "./task.input";

export async function updateTask(obj, args: { uuid: string, input: TaskInput }, context: GraphContext, info): Promise<Task> {
    throw new Error('Not implemented');
}