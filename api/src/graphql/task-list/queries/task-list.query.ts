import { GraphContext } from "../../helpers";
import { TaskList } from "../task-list.model";

export async function taskList(obj, args: { uuid: string }, context: GraphContext, info): Promise<TaskList> {
    throw new Error('Not implemented');
}