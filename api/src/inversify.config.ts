import { Container, injectable, decorate, unmanaged } from "inversify";
import { getConnection, Connection, createConnection } from "typeorm";

import { AccountService } from "./services/account-service";
import { AccountSettingsService } from "./services/account-settings-service";
import { AuthenticationService } from "./services/authentication-service";
import { SessionService } from "./services/session-service";
import { TaskService } from "./services/task-service";
import { TaskListService } from "./services/task-list-service";
import { ChecklistItemService } from "./services/checklist-item-service";
import { TaskTimeLapService } from "./services/task-time-lap-service";
import { ScoreShiftService } from "./services/score-shift-service";
import { TaskListRightService } from "./services/task-list-right-service";

decorate(injectable(), Connection);
decorate(unmanaged(), Connection, 1);

const container = new Container();

// Database connection
const connectionPromise = createConnection();
type ConnectionProvider = () => Promise<Connection>;
container.bind<ConnectionProvider>("ConnectionProvider").toProvider<Connection>((context) => {
    return () => {
        return connectionPromise;
    };
});


// The various services.
container.bind<AccountService>(AccountService).toSelf();
container.bind<AccountSettingsService>(AccountSettingsService).toSelf();
container.bind<AuthenticationService>(AuthenticationService).toSelf();
container.bind<SessionService>(SessionService).toSelf();
container.bind<TaskService>(TaskService).toSelf();
container.bind<TaskListService>(TaskListService).toSelf();
container.bind<ChecklistItemService>(ChecklistItemService).toSelf();
container.bind<ScoreShiftService>(ScoreShiftService).toSelf();
container.bind<TaskTimeLapService>(TaskTimeLapService).toSelf();
container.bind<TaskListRightService>(TaskListRightService).toSelf();

export default container;
