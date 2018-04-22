import * as moment from "moment";
import * as express from "express";
import container from "../inversify.config";

import { SessionEntity } from "../db/entities";
import { getConnection } from "typeorm";
import { AuthenticationService } from "../services/authentication-service";

export async function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authService = container.resolve(AuthenticationService);
    const token = authService.getAuthenticationToken(req);
    if (token == null) {
        res.status(403).send({ error: "No token was provided" });
        return;
    }

    const entityManager = getConnection().createEntityManager();
    // Validate the token
    const session = await entityManager.findOne(SessionEntity, { where: { token: token } });
    if (!session) {
        console.warn(`No session found with token: ${token}`);
        res.status(403).send({ error: "Invalid token" });
        return;
    }

    if (moment(session.expire_on).isBefore(moment())) {
        console.log(`AUTH token expired: ${token}`);
        entityManager.remove(session);
        res.status(403).send({ error: "token expired" });
        return;
    }

    // Call the next resolver.
    return next();
}
