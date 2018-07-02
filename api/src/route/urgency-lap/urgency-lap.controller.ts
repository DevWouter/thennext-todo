import { Response, Request } from "express";
import { injectable } from "inversify";

import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { UrgencyLapService } from "../../services/urgency-lap-service";

import { UrgencyLap } from "../../models/urgency-lap.model";
import { UrgencyLapEntity } from "../../db/entities/urgency-lap.entity";

@injectable()
export class UrgencyLapController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountService,
        private readonly urgencyLapService: UrgencyLapService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const data = req.body as UrgencyLap;

        const entity = new UrgencyLapEntity();
        entity.fromDay = data.fromDay;
        entity.urgencyModifier = data.urgencyModifier;

        // Assign relation.
        entity.owner = account;

        const savePromise = this.urgencyLapService.create(entity);
        const dbData = await savePromise;
        const apiData = <UrgencyLap>{
            fromDay: dbData.fromDay,
            urgencyModifier: dbData.urgencyModifier,
            uuid: dbData.uuid,
        };

        res.send(apiData);
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entries = await this.urgencyLapService.of(account);
        const dst = entries.map(item => (<UrgencyLap>{
            uuid: item.uuid,
            urgencyModifier: item.urgencyModifier,
            fromDay: item.fromDay,
        }));

        res.send(dst);
    }

    async update(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entity = await this.urgencyLapService.byUuid(<string>(req.params.uuid), account);
        const input = req.body as UrgencyLap;

        entity.fromDay = input.fromDay;
        entity.urgencyModifier = input.urgencyModifier;

        const savePromise = this.urgencyLapService.update(entity);
        const dbData = await savePromise;
        const apiData = <UrgencyLap>{
            fromDay: dbData.fromDay,
            urgencyModifier: dbData.urgencyModifier,
            uuid: dbData.uuid,
        };

        res.send(apiData);
    }

    async delete(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entity = await this.urgencyLapService.byUuid(<string>(req.params.uuid), account);

        this.urgencyLapService.destroy(entity);
        res.send({});
    }
}
