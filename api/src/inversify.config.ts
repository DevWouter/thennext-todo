import { Container, injectable, decorate, unmanaged } from "inversify";
import { Connection, createConnection } from "typeorm";

import { AuthenticationService } from "./services/authentication-service";
import { WsMessageService } from "./services/ws-message-service";
import { WsService } from "./services/ws-service";
import { ServerApp } from "./server/server-app";

import {
    AccountRepository,
    TaskListRepository,
    TaskRepository,
    TaskListRightRepository,
    AccountSettingsRepository,
    ChecklistItemRepository,
    ScoreShiftRepository,
    SessionRepository,
    TaskListShareTokenRepository,
    TaskRelationRepository,
    UrgencyLapRepository,
} from "./repositories";

import {
    ScoreShiftService,
    TaskListService,
} from "./services";


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
container.bind<AccountRepository>(AccountRepository).toSelf();
container.bind<TaskRepository>(TaskRepository).toSelf();
container.bind<TaskListRepository>(TaskListRepository).toSelf();
container.bind<AccountSettingsRepository>(AccountSettingsRepository).toSelf();
container.bind<ChecklistItemRepository>(ChecklistItemRepository).toSelf();
container.bind<ScoreShiftRepository>(ScoreShiftRepository).toSelf();
container.bind<SessionRepository>(SessionRepository).toSelf();
container.bind<TaskListRightRepository>(TaskListRightRepository).toSelf();
container.bind<TaskListShareTokenRepository>(TaskListShareTokenRepository).toSelf();
container.bind<TaskRelationRepository>(TaskRelationRepository).toSelf();
container.bind<UrgencyLapRepository>(UrgencyLapRepository).toSelf();

container.bind<AuthenticationService>(AuthenticationService).toSelf();

container.bind<WsMessageService>(WsMessageService).to(WsMessageService).inSingletonScope();
container.bind<WsService>(WsService).to(WsService).inSingletonScope();

container.bind<ScoreShiftService>(ScoreShiftService).toSelf();
container.bind<TaskListService>(TaskListService).toSelf();

container.bind<ServerApp>(ServerApp).toSelf();

export default container;
