import { Response, Request } from "express";
import { injectable } from "inversify";
import { AuthenticationService } from "../../services/authentication-service";
import { ScoreShiftService } from "../../services/score-shift-service";
import { ScoreShiftEntity } from "../../db/entities";
import { ScoreShift } from "../../models/score-shift.model";
import { toModel } from "./helpers";
import { AccountRepository } from "../../repositories";

@injectable()
export class ScoreShiftController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountRepository,
        private readonly scoreShiftService: ScoreShiftService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entity = new ScoreShiftEntity();
        const input = req.body as ScoreShift;

        entity.phrase = input.phrase;
        entity.score = input.score;
        entity.created_on = input.createdOn || new Date();
        entity.updated_on = input.updatedOn || new Date();

        // Assign relations
        entity.owner = account;

        const savePromise = this.scoreShiftService.create(entity);
        savePromise.catch(x => console.error(x));

        // Wait until reload has been completed.
        const dbEntity = await savePromise;
        const apiModel = toModel(dbEntity);

        res.send(apiModel);
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entities = await this.scoreShiftService.of(account);
        const result = entities.map(x => toModel(x));
        res.send(result);
    }

    async update(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entity = await this.scoreShiftService.byUuid(<string>(req.params.uuid), account);
        const input = req.body as ScoreShift;

        entity.phrase = input.phrase;
        entity.score = input.score;
        entity.created_on = input.createdOn;
        entity.updated_on = input.updatedOn;

        const savePromise = this.scoreShiftService.update(entity);
        savePromise.catch(x => console.error(x));

        // Wait until reload has been completed.
        const dbEntity = await savePromise;
        const apiModel = toModel(dbEntity);

        res.send(apiModel);
    }

    async delete(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const scoreShift = await this.scoreShiftService.byUuid(<string>(req.params.uuid), account);

        this.scoreShiftService.destroy(scoreShift);
        res.send({});
    }
}
