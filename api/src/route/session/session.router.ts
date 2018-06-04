import * as express from "express";
import container from "../../inversify.config";
import { isAuthenticated } from "../../helpers/is-authenticated";
import { asyncMiddleware } from "../../helpers/async-helper";
import { SessionController } from "./session.controller";

const controller = container.resolve(SessionController);
const router = express.Router();

router.post("/create", asyncMiddleware(controller.create.bind(controller)));
router.delete("/destroy", [isAuthenticated, asyncMiddleware(controller.destroy.bind(controller))]);
router.patch("/extend", [isAuthenticated, asyncMiddleware(controller.extend.bind(controller))]);

export { router as sessionRouter };
