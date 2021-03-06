import { Container, interfaces } from "inversify";

import { AuthenticationService } from "./services/authentication-service";
import { WsMessageService } from "./services/ws-message-service";
import { WsService } from "./services/ws-service";
import { ServerApp } from "./server/server-app";


import {
    AccountRepository,
    AccountSettingsRepository,
    ChecklistItemRepository,
    ConfirmationTokenRepository,
    ScoreShiftRepository,
    SessionRepository,
    TaskListRepository,
    TaskRelationRepository,
    TaskRepository,
    UrgencyLapRepository,
    PasswordRecoveryTokenRepository,
} from "./repositories";

import {
    AccountService,
    ChecklistItemService,
    LoggerService,
    MailService,
    ScoreShiftService,
    TaskListService,
    TaskRelationService,
    TaskService,
    UrgencyLapService,
    PasswordCheckService,
} from "./services";
import { Database } from "./repositories/database";
import { CreateDatabaseConnection } from "./helpers/create-connection";
import { CleanSessionTokensJob, CleanConfirmationTokensJob, CleanPasswordRecoveryTokensJob } from "./server/jobs";
import { JobManager } from "./server/job-manager";


function getClassName(request: interfaces.Request): string {
    const className = request.parentRequest &&
        request.parentRequest.bindings.length &&
        request.parentRequest.bindings[0].implementationType &&
        (request.parentRequest.bindings[0].implementationType as Function).name;

    return className;
}

function getPath(request: interfaces.Request): string[] {
    const classes: string[] = [];
    while (getClassName(request)) {
        classes.push(getClassName(request));
        request = request.parentRequest;
    }

    return classes;
}


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

// The logger
container.bind<LoggerService>(LoggerService).toDynamicValue((context) => {
    const path = getPath(context.currentRequest);
    return new LoggerService(path.length > 0 ? path[0] : undefined);
});


// The various repositories.
container.bind<AccountRepository>(AccountRepository).toSelf();
container.bind<AccountSettingsRepository>(AccountSettingsRepository).toSelf();
container.bind<ChecklistItemRepository>(ChecklistItemRepository).toSelf();
container.bind<ConfirmationTokenRepository>(ConfirmationTokenRepository).toSelf();
container.bind<PasswordRecoveryTokenRepository>(PasswordRecoveryTokenRepository).toSelf();
container.bind<ScoreShiftRepository>(ScoreShiftRepository).toSelf();
container.bind<SessionRepository>(SessionRepository).toSelf();
container.bind<TaskListRepository>(TaskListRepository).toSelf();
container.bind<TaskRelationRepository>(TaskRelationRepository).toSelf();
container.bind<TaskRepository>(TaskRepository).toSelf();
container.bind<UrgencyLapRepository>(UrgencyLapRepository).toSelf();

// The various jobs
container.bind<CleanSessionTokensJob>(CleanSessionTokensJob).to(CleanSessionTokensJob);
container.bind<CleanConfirmationTokensJob>(CleanConfirmationTokensJob).to(CleanConfirmationTokensJob);
container.bind<CleanPasswordRecoveryTokensJob>(CleanPasswordRecoveryTokensJob).to(CleanPasswordRecoveryTokensJob);

// The job manager
container.bind<JobManager>(JobManager).to(JobManager).inSingletonScope();

// The various services.
container.bind<AuthenticationService>(AuthenticationService).toSelf();

container.bind<WsMessageService>(WsMessageService).to(WsMessageService).inSingletonScope();
container.bind<WsService>(WsService).to(WsService).inSingletonScope();

container.bind<AccountService>(AccountService).toSelf();
container.bind<ChecklistItemService>(ChecklistItemService).toSelf();
container.bind<MailService>(MailService).toSelf();
container.bind<PasswordCheckService>(PasswordCheckService).toSelf();
container.bind<ScoreShiftService>(ScoreShiftService).toSelf();
container.bind<TaskListService>(TaskListService).toSelf();
container.bind<TaskRelationService>(TaskRelationService).toSelf();
container.bind<TaskService>(TaskService).toSelf();
container.bind<UrgencyLapService>(UrgencyLapService).toSelf();

container.bind<ServerApp>(ServerApp).toSelf();



export default container;
