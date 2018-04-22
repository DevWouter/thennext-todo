import { Request, Response } from "express";

import container from "../../inversify.config";

import { AuthenticationService } from "../../services/authentication-service";
import { SessionService } from "../../services/session-service";
import { Session } from "./session.model";

export async function SessionExtend(req: Request, res: Response): Promise<void> {
    const authenticationService = container.resolve(AuthenticationService);
    const sessionService = container.resolve(SessionService);

    const token = authenticationService.getAuthenticationToken(req);
    const session = await sessionService.extend(token);

    // Tell the client the session was deleted.
    res.send(<Session>{
        token: session.token,
        expireAt: session.expire_on,
    });
}
