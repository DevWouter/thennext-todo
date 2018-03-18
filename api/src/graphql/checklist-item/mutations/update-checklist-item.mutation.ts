import { ChecklistItemInput } from "./checklist-item.input";
import { GraphContext } from "../../helpers";
import { ChecklistItem } from "../checklist-item.model";

export async function updateChecklistItem(
    obj,
    args: { uuid: string, input: ChecklistItemInput },
    context: GraphContext,
    info
): Promise<ChecklistItem> {
    throw new Error("Not implemented");
}
