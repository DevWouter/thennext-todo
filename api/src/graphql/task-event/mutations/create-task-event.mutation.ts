import { TaskEvent } from "../task-event.model";
import { GraphContext } from "../../helpers";
import { TaskEventInput } from "./task-event.input";

export async function createTaskEvent(obj, args: { taskUuid: string, input: TaskEventInput }, context: GraphContext, info): Promise<TaskEvent> {
    throw new Error("Not implemented");
}