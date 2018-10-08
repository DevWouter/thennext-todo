import * as express from "express";
import container from "../../inversify.config";

import { asyncMiddleware } from "../../helpers/async-helper";
import { AccountController } from "./account.controller";

const controller = container.resolve(AccountController);
const router = express.Router();

router.post("/", asyncMiddleware(controller.create.bind(controller)));
router.post("/confirm-token", asyncMiddleware(controller.confirm.bind(controller)));
router.post("/create-recovery-token", asyncMiddleware(controller.createRecovery.bind(controller)));
router.post("/reset-password", asyncMiddleware(controller.resetPassword.bind(controller)));

export { router as accountRouter };
