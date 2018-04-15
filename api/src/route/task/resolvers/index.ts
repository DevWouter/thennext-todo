import { getChecklistItems } from "./get-checklist-items.resolver";
import { getEvents } from "./get-events.resolver";
import { getRelations } from "./get-relations.resolver";

export const TaskResolvers = {
    checklistItems: getChecklistItems,
    events: getEvents,
    relations: getRelations,
};
