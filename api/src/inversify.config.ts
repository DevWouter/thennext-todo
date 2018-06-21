import { Container, injectable, decorate, unmanaged } from "inversify";
import { Connection, createConnection } from "typeorm";

import { AccountService } from "./services/account-service";
import { AccountSettingsService } from "./services/account-settings-service";
import { AuthenticationService } from "./services/authentication-service";
import { ChecklistItemService } from "./services/checklist-item-service";
import { ScoreShiftService } from "./services/score-shift-service";
import { SessionService } from "./services/session-service";
import { TaskListRightService } from "./services/task-list-right-service";
import { TaskListService } from "./services/task-list-service";
import { TaskListShareTokenService } from "./services/task-list-share-token-service";
import { TaskRelationService } from "./services/task-relation-service";
import { TaskService } from "./services/task-service";
import { TaskTimeLapService } from "./services/task-time-lap-service";
import { UrgencyLapService } from "./services/urgency-lap-service";
import { WebSocketService } from "./services/web-socket-service";

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
container.bind<ChecklistItemService>(ChecklistItemService).toSelf();
container.bind<ScoreShiftService>(ScoreShiftService).toSelf();
container.bind<SessionService>(SessionService).toSelf();
container.bind<TaskListRightService>(TaskListRightService).toSelf();
container.bind<TaskListService>(TaskListService).toSelf();
container.bind<TaskListShareTokenService>(TaskListShareTokenService).toSelf();
container.bind<TaskRelationService>(TaskRelationService).toSelf();
container.bind<TaskService>(TaskService).toSelf();
container.bind<TaskTimeLapService>(TaskTimeLapService).toSelf();
container.bind<UrgencyLapService>(UrgencyLapService).toSelf();
container.bind<WebSocketService>(WebSocketService).toSelf();

export default container;
