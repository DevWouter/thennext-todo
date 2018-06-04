import * as express from "express";
import container from "../../inversify.config";
import { asyncMiddleware } from "../../helpers/async-helper";
import { TaskTimeLapController } from "./task-time-lap.controller";

const controller = container.resolve(TaskTimeLapController);

const router = express.Router();

router.get("/index", asyncMiddleware(controller.index.bind(controller)));
router.post("/create", asyncMiddleware(controller.create.bind(controller)));
router.patch("/:uuid", asyncMiddleware(controller.update.bind(controller)));
router.delete("/:uuid", asyncMiddleware(controller.delete.bind(controller)));

export { router as taskTimeLapRouter };
