import { GraphContext } from "../../helpers";
import { TaskRelation } from "../task-relation.model";
import { TaskRelationInput } from "./task-relation.input";

export async function createTaskRelation(obj, args: { input: TaskRelationInput }, context: GraphContext, info): Promise<TaskRelation> {
    throw new Error("Not implemented");
}
