import { TaskList } from "../task-list";
import { TaskListInput } from "./task-list.input";
import { GraphContext } from "../../helpers";

export async function updateTaskList(obj, args: { uuid: string, input: TaskListInput }, context: GraphContext, info): Promise<TaskList> {
    throw new Error("Not implemented");
}