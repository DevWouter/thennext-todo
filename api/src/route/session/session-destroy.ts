import { Request, Response } from "express";

import container from "../../inversify.config";

import { AuthenticationService } from "../../services/authentication-service";
import { SessionService } from "../../services/session-service";

export async function SessionDestroy(req: Request, res: Response): Promise<void> {
    const authenticationService = container.resolve(AuthenticationService);
    const sessionService = container.resolve(SessionService);

    const token = authenticationService.getAuthenticationToken(req);
    const session = await sessionService.byToken(token);

    await sessionService.destroy(session);
    res.send({});
}
