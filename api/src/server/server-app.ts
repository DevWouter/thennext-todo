import { injectable } from "inversify";
import {
    TaskListService,
    ScoreShiftService
} from "../services";


@injectable()
export class ServerApp {
    constructor(
        private readonly taskListService: TaskListService,
        private readonly tagScoringService: ScoreShiftService,
    ) {
    }
}
