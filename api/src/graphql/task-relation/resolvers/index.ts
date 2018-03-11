import { getSourceTask } from "./get-source-task.resolver";
import { getTargetTask } from "./get-target-task.resolver";

export const TaskRelationResolvers = {
    sourceTask: getSourceTask,
    targetTask: getTargetTask,
}