import { Request, Response } from "express";

import { Session } from "./session.model";
import container from "../../inversify.config";
import { SessionService } from "../../services/session-service";

export interface SessionCreateInput {
    readonly email: string;
    readonly password: string;
}

export async function SessionCreate(req: Request, res: Response): Promise<void> {
    const input = req.body as SessionCreateInput;
    const sessionService = container.resolve(SessionService);
    try {
        const session = await sessionService.create(input.email, input.password);

        const result = <Session>{
            token: session.token,
            expireAt: session.expire_on,
        };

        res.send(result);
    } catch (ex) {
        res.status(401).send({});
    }
}
