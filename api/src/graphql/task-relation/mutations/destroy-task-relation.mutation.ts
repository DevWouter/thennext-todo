import { GraphContext } from "../../helpers";
import { TaskRelation } from "../task-relation.model";
import { TaskRelationInput } from "./task-relation.input";

export async function destroyTaskRelation(obj, args: { input: string }, context: GraphContext, info): Promise<boolean> {
    throw new Error("Not implemented");
}