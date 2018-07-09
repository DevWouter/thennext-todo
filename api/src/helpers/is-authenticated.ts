import * as moment from "moment";
import * as express from "express";
import container from "../inversify.config";

import { AuthenticationService } from "../services/authentication-service";
import { SessionService } from "../services/session-service";
import { AccountRepository } from "../repositories";

export async function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountRepository);
    const sessionService = container.resolve(SessionService);

    const token = authService.getAuthenticationToken(req);
    if (token == null) {
        res.status(403).send({ error: "No token was provided" });
        return;
    }

    const session = await sessionService.byToken(token);
    if (!session) {
        console.warn(`No session found with token: ${token}`);
        res.status(403).send({ error: "Invalid token" });
        return;
    }

    if (moment(session.expire_on).isBefore(moment())) {
        console.log(`AUTH token expired: ${token}`);
        sessionService.destroy(session);
        res.status(403).send({ error: "token expired" });
        return;
    }

    // Call the next resolver.
    return next();
}
