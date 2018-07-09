import { injectable } from "inversify";
import { TaskListService } from "../services/task-list-service";


@injectable()
export class ServerApp {
    constructor(
        private readonly taskListService: TaskListService,
    ) {
    }
}
