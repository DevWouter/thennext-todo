import { GraphContext } from "../../helpers";
import { Task } from "../task.model";

export async function tasks(obj, args: {}, context: GraphContext, info): Promise<Task[]> {
    throw new Error("Not implemented");
}
