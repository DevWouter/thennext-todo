import { ChecklistItem } from "../checklist-item.model";
import { GraphContext } from "../../helpers";
import { Task } from "../../task/task.model";

export async function getTask(obj: ChecklistItem, args: {}, context: GraphContext, info): Promise<Task> {
    throw new Error("not implemented");
}