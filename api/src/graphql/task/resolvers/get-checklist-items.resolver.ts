import { GraphContext } from "../../helpers";
import { Task } from "../task.model";
import { ChecklistItem } from "../../checklist-item/checklist-item.model";

export async function getChecklistItems(obj: Task, args: {}, context: GraphContext, info): Promise<ChecklistItem[]> {
    throw new Error('Not implemented');
}