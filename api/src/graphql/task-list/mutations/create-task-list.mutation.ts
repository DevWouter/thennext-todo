import { TaskList } from "../task-list";
import { TaskListInput } from "./task-list.input";
import { GraphContext } from "../../helpers";

export async function createTaskList(obj, args: { name: string }, context: GraphContext, info): Promise<TaskList> {
    throw new Error("Not implemented");
}