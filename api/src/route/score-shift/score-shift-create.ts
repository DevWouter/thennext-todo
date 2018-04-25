import { Request, Response } from "express";
import container from "../../inversify.config";

import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { ScoreShiftService } from "../../services/score-shift-service";

import { ScoreShift } from "./score-shift.model";
import { ScoreShiftEntity } from "../../db/entities";

import { toModel } from "./helpers";

export async function ScoreShiftCreate(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const scoreShiftService = container.resolve(ScoreShiftService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entity = new ScoreShiftEntity();
    const input = req.body as ScoreShift;

    entity.phrase = input.phrase;
    entity.score = input.score;
    entity.created_on = input.createdOn || new Date();
    entity.updated_on = input.updatedOn || new Date();

    // Assign relations
    entity.owner = account;

    const savePromise = scoreShiftService.create(entity);
    savePromise.catch(x => console.error(x));

    // Wait until reload has been completed.
    const dbEntity = await savePromise;
    const apiModel = toModel(dbEntity);

    res.send(apiModel);
}
