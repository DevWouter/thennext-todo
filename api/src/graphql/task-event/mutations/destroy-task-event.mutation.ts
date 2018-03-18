import { TaskEvent } from "../task-event.model";
import { GraphContext } from "../../helpers";
import { TaskEventInput } from "./task-event.input";

export async function destroyTaskEvent(obj, args: { uuid: string }, context: GraphContext, info): Promise<boolean> {
    throw new Error("Not implemented");
}
