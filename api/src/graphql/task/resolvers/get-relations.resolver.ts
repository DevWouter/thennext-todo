import { GraphContext } from "../../helpers";
import { Task } from "../task.model";
import { TaskRelation } from "../../task-relation/task-relation.model";

export async function getRelations(obj: Task, args: {}, context: GraphContext, info): Promise<TaskRelation[]> {
    throw new Error('Not implemented');
}