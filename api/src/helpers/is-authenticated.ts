import * as moment from "moment";
import * as express from "express";

import { SessionEntity } from "../db/entities";
import { getAuthorizationToken } from "../server/get-authorization-token";
import { getConnection } from "typeorm";

export async function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = getAuthorizationToken(req);
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
