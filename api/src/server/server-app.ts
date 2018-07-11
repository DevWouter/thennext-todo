import { injectable } from "inversify";
import {
    TaskListService,
    ScoreShiftService,
    UrgencyLapService,
    TaskRelationService
} from "../services";


@injectable()
export class ServerApp {
    constructor(
        private readonly tagScoringService: ScoreShiftService,
        private readonly taskListService: TaskListService,
        private readonly taskRelationService: TaskRelationService,
        private readonly urgencyLapService: UrgencyLapService,
    ) {
    }
}
