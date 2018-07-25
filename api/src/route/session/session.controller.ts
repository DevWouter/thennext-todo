import { Response, Request } from "express";
import { injectable } from "inversify";
import { AuthenticationService } from "../../services/authentication-service";
import { Session } from "../../models/session.model";

import { SessionRepository } from "../../repositories";


interface SessionCreateInput {
    readonly email: string;
    readonly password: string;
}

@injectable()
export class SessionController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly sessionService: SessionRepository,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const input = req.body as SessionCreateInput;

        try {
            const session = await this.sessionService.create(input.email, input.password);

            const result: Session = {
                token: session.token,
            };

            res.send(result);
        } catch (ex) {
            res.status(401).send({});
        }
    }

    async destroy(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const session = await this.sessionService.byToken(token);

        await this.sessionService.destroy(session);
        res.send({});
    }
}
