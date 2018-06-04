import * as express from "express";
import { asyncMiddleware } from "../../helpers/async-helper";

import { ScoreShiftController } from "./score-shift.controller";
import container from "../../inversify.config";

const controller = container.resolve(ScoreShiftController);
const router = express.Router();

router.get("/index", asyncMiddleware(controller.index.bind(controller)));
router.post("/create", asyncMiddleware(controller.create.bind(controller)));
router.patch("/:uuid", asyncMiddleware(controller.update.bind(controller)));
router.delete("/:uuid", asyncMiddleware(controller.delete.bind(controller)));

export { router as scoreShiftRouter };
