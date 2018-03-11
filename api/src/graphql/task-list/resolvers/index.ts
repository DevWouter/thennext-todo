import { getOwner } from "./get-owner.resolver";
import { getTasks } from "./get-tasks.resolver";

export const TaskListResolvers = {
    owner: getOwner,
    tasks: getTasks,
};