import { injectable } from "inversify";
import {
    ChecklistItemService,
    ScoreShiftService,
    TaskListService,
    TaskRelationService,
    UrgencyLapService,
} from "../services";


@injectable()
export class ServerApp {
    constructor(
        private readonly checklistItemService: ChecklistItemService,
        private readonly tagScoringService: ScoreShiftService,
        private readonly taskListService: TaskListService,
        private readonly taskRelationService: TaskRelationService,
        private readonly urgencyLapService: UrgencyLapService,
    ) {
    }
}
