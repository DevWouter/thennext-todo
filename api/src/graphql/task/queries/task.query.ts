import { GraphContext } from "../../helpers";
import { Task } from "../task.model";

export async function task(obj, args: { uuid: string }, context: GraphContext, info): Promise<Task> {
    throw new Error("Not implemented");
}
