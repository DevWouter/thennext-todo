import { Request, Response } from "express";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { ScoreShiftService } from "../../services/score-shift-service";

export async function ScoreShiftDelete(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const scoreShiftService = container.resolve(ScoreShiftService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const scoreShift = await scoreShiftService.byUuid(<string>(req.params.uuid), account);

    scoreShiftService.destroy(scoreShift);
    res.send({});
}
