import { TaskList } from "../task-list";
import { TaskListInput } from "./task-list.input";
import { GraphContext } from "../../helpers";

export async function destroyTaskList(obj, args: { uuid: string }, context: GraphContext, info): Promise<boolean> {
    throw new Error("Not implemented");
}