import { GraphContext } from "../../helpers";
import { TaskList } from "../task-list.model";

export async function taskLists(obj, args: {}, context: GraphContext, info): Promise<TaskList[]> {
    throw new Error('Not implemented');
}