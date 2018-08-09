import * as express from "express";
import container from "../../inversify.config";

import { isAuthenticated } from "../../helpers/is-authenticated";
import { asyncMiddleware } from "../../helpers/async-helper";
import { AccountController } from "./account.controller";

const controller = container.resolve(AccountController);
const router = express.Router();

router.post("/", asyncMiddleware(controller.create.bind(controller)));

export { router as accountRouter };
