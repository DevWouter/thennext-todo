import * as express from "express";
import container from "../../inversify.config";

import { asyncMiddleware } from "../../helpers/async-helper";
import { TaskRelationController } from "./task-relation.controller";

const controller = container.resolve(TaskRelationController);
const router = express.Router();

router.get("/index", asyncMiddleware(controller.index.bind(controller)));
router.post("/create", asyncMiddleware(controller.create.bind(controller)));
router.delete("/:uuid", asyncMiddleware(controller.delete.bind(controller)));


export { router as taskRelationRouter };
