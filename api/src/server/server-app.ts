import { injectable } from "inversify";
import {
    TaskListService,
    ScoreShiftService,
    UrgencyLapService
} from "../services";


@injectable()
export class ServerApp {
    constructor(
        private readonly taskListService: TaskListService,
        private readonly tagScoringService: ScoreShiftService,
        private readonly urgencyLapService: UrgencyLapService,
    ) {
    }
}
