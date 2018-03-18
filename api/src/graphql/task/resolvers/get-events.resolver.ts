import { GraphContext } from "../../helpers";
import { Task } from "../task.model";
import { TaskEvent } from "../../task-event/task-event.model";

export async function getEvents(obj: Task, args: {}, context: GraphContext, info): Promise<TaskEvent[]> {
    throw new Error("Not implemented");
}
