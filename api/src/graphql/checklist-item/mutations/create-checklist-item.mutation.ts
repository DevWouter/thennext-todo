import { GraphContext } from "../../helpers";
import { ChecklistItem } from "../checklist-item.model";
import { ChecklistItemInput } from "./checklist-item.input";

export async function createChecklistItem(obj, args: { taskUuid: string, input: ChecklistItemInput }, context: GraphContext, info): Promise<ChecklistItem> {
    throw new Error('Not implemented');
}