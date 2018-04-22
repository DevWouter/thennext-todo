import { Container, injectable, decorate, unmanaged } from "inversify";
import { AccountService } from "./services/account-service";
import { AuthenticationService } from "./services/authentication-service";
import { getConnection, Connection } from "typeorm";

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

export default container;
