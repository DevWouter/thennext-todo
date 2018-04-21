import { Container } from "inversify";
import { AuthenticationService } from "./services/authentication-service";

const container = new Container();

container.bind<AuthenticationService>(AuthenticationService).toSelf();

export default container;
