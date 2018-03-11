import { GraphContext } from "../../helpers";
import { Task } from "../../task/task.model";
import { TaskRelation } from "../task-relation.model";

export async function getSourceTask(obj: TaskRelation, args: {}, context: GraphContext, info): Promise<Task> {
    throw new Error("not implemented");
}