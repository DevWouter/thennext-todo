import { Container, injectable, decorate, unmanaged } from "inversify";
import { getConnection, Connection } from "typeorm";

import { AccountService } from "./services/account-service";
import { AuthenticationService } from "./services/authentication-service";
import { SessionService } from "./services/session-service";
import { TaskService } from "./services/task-service";

decorate(injectable(), Connection);
decorate(unmanaged(), Connection, 1);

const container = new Container();

// Database connection
container.bind<Connection>(Connection)
    .toDynamicValue(() => getConnection())
    .inSingletonScope();

// The various services.
container.bind<AccountService>(AccountService).toSelf();
container.bind<AuthenticationService>(AuthenticationService).toSelf();
container.bind<SessionService>(SessionService).toSelf();
container.bind<TaskService>(TaskService).toSelf();

export default container;
