import { GraphContext } from "../../helpers";
import { Account } from "../../account/account.model";
import { TaskList } from "../task-list";
import { Task } from "../../task/task.model";

export async function getTasks(obj: TaskList, args, context: GraphContext, info): Promise<Task[]> {
    throw new Error('Not implemented');
}