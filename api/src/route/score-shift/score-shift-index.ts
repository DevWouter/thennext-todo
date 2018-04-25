import { Request, Response } from "express";
import container from "../../inversify.config";
import { ScoreShiftService } from "../../services/score-shift-service";
import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { toModel } from "./helpers";

export async function ScoreShiftIndex(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const scoreShiftService = container.resolve(ScoreShiftService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entities = await scoreShiftService.of(account);
    const result = entities.map(x => toModel(x));
    res.send(result);
}
