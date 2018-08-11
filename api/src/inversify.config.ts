import { Container } from "inversify";

import { AuthenticationService } from "./services/authentication-service";
import { WsMessageService } from "./services/ws-message-service";
import { WsService } from "./services/ws-service";
import { ServerApp } from "./server/server-app";


import {
    AccountRepository,
    AccountSettingsRepository,
    ChecklistItemRepository,
    ScoreShiftRepository,
    SessionRepository,
    TaskListRepository,
    TaskListRightRepository,
    TaskListShareTokenRepository,
    TaskRelationRepository,
    TaskRepository,
    UrgencyLapRepository,
} from "./repositories";

import {
    AccountService,
    ChecklistItemService,
    MailService,
    ScoreShiftService,
    TaskListRightService,
    TaskListService,
    TaskListShareService,
    TaskRelationService,
    TaskService,
    UrgencyLapService,
} from "./services";
import { Database } from "./repositories/database";
import { CreateDatabaseConnection } from "./helpers/create-connection";


const container = new Container();

// Database connection
const databasePromise = new Promise<Database>((resolve, reject) => {
    try {
        console.log("Creating database connection");
        resolve(new Database(CreateDatabaseConnection()));
        console.log("Database connection created");
    } catch (error) {
        reject(error);
    }
});

type DatabaseProvider = () => Promise<Database>;
container.bind<DatabaseProvider>("Database").toProvider<Database>((context) => {
    return () => {
        return databasePromise;
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

container.bind<AccountService>(AccountService).toSelf();
container.bind<ChecklistItemService>(ChecklistItemService).toSelf();
container.bind<MailService>(MailService).toSelf();
container.bind<ScoreShiftService>(ScoreShiftService).toSelf();
container.bind<TaskListRightService>(TaskListRightService).toSelf();
container.bind<TaskListService>(TaskListService).toSelf();
container.bind<TaskListShareService>(TaskListShareService).toSelf();
container.bind<TaskRelationService>(TaskRelationService).toSelf();
container.bind<TaskService>(TaskService).toSelf();
container.bind<UrgencyLapService>(UrgencyLapService).toSelf();

container.bind<ServerApp>(ServerApp).toSelf();

export default container;
